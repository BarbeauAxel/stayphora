import * as THREE from "three";

/**
 * Navigation « Street View » à la première personne.
 *
 * La caméra garde une hauteur d'œil fixe (on marche dans le logement) ;
 * seuls les points de vue prédéfinis peuvent changer cette hauteur.
 * Toutes les entrées modifient un état CIBLE, vers lequel l'état affiché
 * converge avec un amortissement exponentiel : mouvements fluides,
 * indépendants du nombre d'images par seconde.
 *
 * Entrées :
 * - souris / un doigt : glisser pour regarder autour
 * - molette / pincement : avancer, reculer
 * - deux doigts : se déplacer (latéralement et en profondeur)
 * - clavier (si le viewer a le focus) : flèches ↑↓ avancer/reculer, ←→ tourner,
 *   WASD / ZQSD (touches physiques) se déplacer
 * - double-clic / double-tap : se rendre vers le point visé
 */

export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

export interface Viewpoint {
  position: [number, number, number];
  target: [number, number, number];
}

interface ControlsOptions {
  element: HTMLElement;
  camera: THREE.PerspectiveCamera;
  bounds: Bounds;
  /** Appelé à chaque geste de l'utilisateur (masque l'indice, arrête la visite guidée). */
  onInteract?: () => void;
  /** Renvoie le point 3D visé sous le pointeur (coordonnées écran normalisées). */
  pick?: (ndc: THREE.Vector2) => THREE.Vector3 | null;
}

const MAX_PITCH = THREE.MathUtils.degToRad(80);
const LOOK_SPEED = 0.0042; // radians par pixel
const KEY_MOVE_SPEED = 1.6; // m/s
const KEY_TURN_SPEED = 1.6; // rad/s
const WHEEL_STEP = 0.0035; // m par unité de deltaY
const MAX_WHEEL_STEP = 0.6;
const PINCH_SPEED = 0.012; // m par pixel d'écartement
const PAN_SPEED = 0.006; // m par pixel
const STOP_BEFORE_HIT = 0.6; // m : s'arrête avant le point visé

export class WalkControls {
  readonly position = new THREE.Vector3();
  yaw = 0;
  pitch = 0;

  private readonly targetPosition = new THREE.Vector3();
  private targetYaw = 0;
  private targetPitch = 0;

  /** Amortissements (plus grand = plus réactif). */
  moveDamping = 5;
  lookDamping = 9;

  enabled = true;
  private readonly keys = new Set<string>();
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private pinchDistance = 0;
  private pinchCenter = { x: 0, y: 0 };
  private lastTap = { time: 0, x: 0, y: 0 };
  private readonly listeners: Array<[EventTarget, string, EventListener, AddEventListenerOptions?]> = [];

  private readonly el: HTMLElement;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly bounds: Bounds;
  private readonly onInteract?: () => void;
  private readonly pick?: (ndc: THREE.Vector2) => THREE.Vector3 | null;

  constructor(opts: ControlsOptions) {
    this.el = opts.element;
    this.camera = opts.camera;
    this.bounds = opts.bounds;
    this.onInteract = opts.onInteract;
    this.pick = opts.pick;

    this.on(this.el, "pointerdown", this.onPointerDown as EventListener);
    this.on(this.el, "pointermove", this.onPointerMove as EventListener);
    this.on(this.el, "pointerup", this.onPointerUp as EventListener);
    this.on(this.el, "pointercancel", this.onPointerUp as EventListener);
    this.on(this.el, "wheel", this.onWheel as EventListener, { passive: false });
    this.on(this.el, "keydown", this.onKeyDown as EventListener);
    this.on(this.el, "keyup", this.onKeyUp as EventListener);
    this.on(this.el, "blur", () => this.keys.clear());
    this.on(this.el, "dblclick", this.onDoubleClick as EventListener);
  }

  /** Place la caméra sur un point de vue. `instant` : sans transition. */
  setViewpoint(view: Viewpoint, instant = false) {
    const pos = new THREE.Vector3(...view.position);
    const dir = new THREE.Vector3(...view.target).sub(pos);
    this.targetPosition.copy(this.clamp(pos, false));
    // Choisit l'angle le plus proche de l'angle courant (pas de tour complet).
    const yaw = Math.atan2(-dir.x, -dir.z);
    this.targetYaw = this.yaw + wrapAngle(yaw - this.yaw);
    this.targetPitch = THREE.MathUtils.clamp(Math.atan2(dir.y, Math.hypot(dir.x, dir.z)), -MAX_PITCH, MAX_PITCH);
    if (instant) {
      this.position.copy(this.targetPosition);
      this.yaw = this.targetYaw;
      this.pitch = this.targetPitch;
    }
  }

  /** Point de vue courant (pour le mode debug et la définition des pièces). */
  getViewpoint(): Viewpoint {
    const dir = new THREE.Vector3(-Math.sin(this.yaw) * Math.cos(this.pitch), Math.sin(this.pitch), -Math.cos(this.yaw) * Math.cos(this.pitch));
    const t = this.position.clone().add(dir.multiplyScalar(2));
    const r = (v: number) => Math.round(v * 100) / 100;
    return { position: [r(this.position.x), r(this.position.y), r(this.position.z)], target: [r(t.x), r(t.y), r(t.z)] };
  }

  /** Vrai tant que la caméra est en mouvement (utile pour rendre à la demande). */
  get moving(): boolean {
    return (
      this.keys.size > 0 ||
      this.position.distanceToSquared(this.targetPosition) > 1e-6 ||
      Math.abs(this.yaw - this.targetYaw) > 1e-4 ||
      Math.abs(this.pitch - this.targetPitch) > 1e-4
    );
  }

  update(dt: number) {
    if (this.enabled && this.keys.size > 0) this.applyKeys(dt);

    const kMove = 1 - Math.exp(-this.moveDamping * dt);
    const kLook = 1 - Math.exp(-this.lookDamping * dt);
    this.position.lerp(this.targetPosition, kMove);
    this.yaw += (this.targetYaw - this.yaw) * kLook;
    this.pitch += (this.targetPitch - this.pitch) * kLook;

    this.camera.position.copy(this.position);
    this.camera.rotation.set(this.pitch, this.yaw, 0, "YXZ");
  }

  dispose() {
    for (const [target, type, fn, opts] of this.listeners) target.removeEventListener(type, fn, opts);
    this.listeners.length = 0;
    this.keys.clear();
    this.pointers.clear();
  }

  // ── Déplacements ────────────────────────────────────────────────────────

  private forward(): THREE.Vector3 {
    return new THREE.Vector3(-Math.sin(this.targetYaw), 0, -Math.cos(this.targetYaw));
  }

  private right(): THREE.Vector3 {
    return new THREE.Vector3(Math.cos(this.targetYaw), 0, -Math.sin(this.targetYaw));
  }

  private move(forward: number, strafe: number) {
    const delta = this.forward().multiplyScalar(forward).add(this.right().multiplyScalar(strafe));
    this.targetPosition.copy(this.clamp(this.targetPosition.clone().add(delta), true));
  }

  private look(dYaw: number, dPitch: number) {
    this.targetYaw += dYaw;
    this.targetPitch = THREE.MathUtils.clamp(this.targetPitch + dPitch, -MAX_PITCH, MAX_PITCH);
  }

  private clamp(p: THREE.Vector3, keepHeight: boolean): THREE.Vector3 {
    const { min, max } = this.bounds;
    return new THREE.Vector3(
      THREE.MathUtils.clamp(p.x, min[0], max[0]),
      keepHeight ? this.targetPosition.y : THREE.MathUtils.clamp(p.y, min[1], max[1]),
      THREE.MathUtils.clamp(p.z, min[2], max[2]),
    );
  }

  private applyKeys(dt: number) {
    const k = this.keys;
    const fwd = (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) - (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0);
    const side = (k.has("KeyD") ? 1 : 0) - (k.has("KeyA") ? 1 : 0);
    const turn = (k.has("ArrowLeft") ? 1 : 0) - (k.has("ArrowRight") ? 1 : 0);
    const boost = k.has("ShiftLeft") || k.has("ShiftRight") ? 2 : 1;
    if (fwd || side) this.move(fwd * KEY_MOVE_SPEED * boost * dt, side * KEY_MOVE_SPEED * boost * dt);
    if (turn) this.look(turn * KEY_TURN_SPEED * dt, 0);
  }

  private flyTo(point: THREE.Vector3) {
    const from = this.targetPosition.clone();
    const flat = new THREE.Vector3(point.x - from.x, 0, point.z - from.z);
    const distance = flat.length();
    if (distance < 0.05) return;
    const travel = Math.max(0, distance - STOP_BEFORE_HIT);
    const dest = from.clone().add(flat.clone().normalize().multiplyScalar(travel));
    this.targetPosition.copy(this.clamp(dest, true));
    const yaw = Math.atan2(-flat.x, -flat.z);
    this.targetYaw = this.targetYaw + wrapAngle(yaw - this.targetYaw);
    this.targetPitch *= 0.5;
  }

  // ── Événements ──────────────────────────────────────────────────────────

  private on(target: EventTarget, type: string, fn: EventListener, opts?: AddEventListenerOptions) {
    target.addEventListener(type, fn, opts);
    this.listeners.push([target, type, fn, opts]);
  }

  private markInteracted() {
    this.onInteract?.();
  }

  private onPointerDown = (e: PointerEvent) => {
    if (!this.enabled || (e.pointerType === "mouse" && e.button !== 0)) return;
    this.el.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 2) this.startPinch();
    if (e.pointerType !== "mouse" && this.pointers.size === 1) this.detectDoubleTap(e);
    this.markInteracted();
  };

  private onPointerMove = (e: PointerEvent) => {
    const prev = this.pointers.get(e.pointerId);
    if (!prev || !this.enabled) return;
    const dx = e.clientX - prev.x;
    const dy = e.clientY - prev.y;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (this.pointers.size === 1) {
      // « Attraper » la scène : glisser à droite fait tourner la vue vers la gauche.
      this.look(dx * LOOK_SPEED, dy * LOOK_SPEED);
    } else if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const center = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const pinch = (distance - this.pinchDistance) * PINCH_SPEED;
      const panX = (center.x - this.pinchCenter.x) * PAN_SPEED;
      const panY = (center.y - this.pinchCenter.y) * PAN_SPEED;
      // Écarter les doigts ou les glisser vers le haut : avancer. Glisser à droite : aller à gauche.
      this.move(pinch - panY, -panX);
      this.pinchDistance = distance;
      this.pinchCenter = center;
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    if (this.el.hasPointerCapture(e.pointerId)) this.el.releasePointerCapture(e.pointerId);
    this.pointers.delete(e.pointerId);
    if (this.pointers.size === 2) this.startPinch();
  };

  private startPinch() {
    const [a, b] = [...this.pointers.values()] as [{ x: number; y: number }, { x: number; y: number }];
    this.pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
    this.pinchCenter = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  }

  private onWheel = (e: WheelEvent) => {
    if (!this.enabled) return;
    e.preventDefault();
    const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1;
    const step = THREE.MathUtils.clamp(-e.deltaY * scale * WHEEL_STEP, -MAX_WHEEL_STEP, MAX_WHEEL_STEP);
    this.move(step, 0);
    this.markInteracted();
  };

  private onKeyDown = (e: KeyboardEvent) => {
    if (!this.enabled || e.altKey || e.ctrlKey || e.metaKey) return;
    const handled = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "ShiftLeft", "ShiftRight"];
    if (!handled.includes(e.code)) return;
    if (e.code.startsWith("Arrow")) e.preventDefault(); // n'entraîne pas le défilement de la page
    this.keys.add(e.code);
    this.markInteracted();
  };

  private onKeyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.code);
  };

  private onDoubleClick = (e: MouseEvent) => {
    if (!this.enabled) return;
    this.markInteracted();
    this.pickAndFly(e.clientX, e.clientY);
  };

  private detectDoubleTap(e: PointerEvent) {
    const now = performance.now();
    const close = Math.hypot(e.clientX - this.lastTap.x, e.clientY - this.lastTap.y) < 30;
    if (now - this.lastTap.time < 300 && close) {
      this.pickAndFly(e.clientX, e.clientY);
      this.lastTap.time = 0;
    } else {
      this.lastTap = { time: now, x: e.clientX, y: e.clientY };
    }
  }

  private pickAndFly(clientX: number, clientY: number) {
    if (!this.pick) return;
    const rect = this.el.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    const hit = this.pick(ndc);
    if (hit) this.flyTo(hit);
  }
}

/** Ramène un angle dans ]-π, π]. */
function wrapAngle(a: number): number {
  return Math.atan2(Math.sin(a), Math.cos(a));
}
