import * as THREE from "three";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";
import { WalkControls, type Bounds, type Viewpoint } from "./controls";

/**
 * Moteur de visite 3D (three.js + Spark), indépendant de React.
 * Ce module n'est importé que par TourViewer, lui-même chargé à la demande :
 * three.js et Spark n'alourdissent jamais le chargement initial du site.
 */

export interface EngineOptions {
  container: HTMLElement;
  bounds: Bounds;
  start: Viewpoint;
  fov?: number;
  onInteract?: () => void;
}

export class TourEngine {
  readonly renderer: THREE.WebGLRenderer;
  readonly camera: THREE.PerspectiveCamera;
  readonly controls: WalkControls;
  private readonly scene = new THREE.Scene();
  private readonly spark: SparkRenderer;
  private mesh: SplatMesh | null = null;
  private readonly timer = new THREE.Timer();
  private readonly resizeObserver: ResizeObserver;
  private readonly visibilityObserver: IntersectionObserver;
  private onScreen = true;
  private running = false;
  private disposed = false;
  private readonly container: HTMLElement;
  /** Support de la caméra en VR : le casque se déplace à l'intérieur de ce « rig ». */
  private readonly rig = new THREE.Group();
  private readonly bounds: EngineOptions["bounds"];
  private xrSession: XRSession | null = null;
  private snapReady = true;
  onXrChange?: (active: boolean) => void;

  constructor(opts: EngineOptions) {
    this.container = opts.container;
    const mobile = window.matchMedia("(pointer: coarse)").matches;

    this.renderer = new THREE.WebGLRenderer({
      antialias: false, // inutile avec le splatting, coûteux sur mobile
      alpha: false,
      powerPreference: "high-performance",
    });
    // Pixel ratio plafonné : énorme gain de fluidité sur les écrans mobiles haute densité.
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75));
    this.renderer.setClearColor(0x1f1b16);
    const canvas = this.renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.touchAction = "none";
    canvas.setAttribute("aria-hidden", "true");
    this.container.appendChild(canvas);

    this.camera = new THREE.PerspectiveCamera(opts.fov ?? 70, 1, 0.05, 200);
    this.bounds = opts.bounds;
    this.rig.add(this.camera);
    this.scene.add(this.rig);
    this.renderer.xr.enabled = true;
    this.spark = new SparkRenderer({ renderer: this.renderer });
    this.scene.add(this.spark);

    this.controls = new WalkControls({
      element: this.container,
      camera: this.camera,
      bounds: opts.bounds,
      onInteract: opts.onInteract,
      pick: (ndc) => this.pick(ndc),
    });
    this.controls.setViewpoint(opts.start, true);
    this.controls.update(0);

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(this.container);
    this.resize();

    // Pause du rendu quand le viewer sort de l'écran ou que l'onglet est caché.
    this.visibilityObserver = new IntersectionObserver(([entry]) => {
      this.onScreen = entry?.isIntersecting ?? true;
      this.updateLoop();
    });
    this.visibilityObserver.observe(this.container);
    document.addEventListener("visibilitychange", this.updateLoop);
  }

  /** Charge la scène ; `onProgress` reçoit une valeur entre 0 et 1 (ou null si inconnue). */
  async load(url: string, onProgress: (ratio: number | null) => void): Promise<void> {
    const mesh = new SplatMesh({
      url,
      raycastable: true,
      onProgress: (event: ProgressEvent) => {
        onProgress(event.lengthComputable && event.total > 0 ? event.loaded / event.total : null);
      },
    });
    this.mesh = mesh;
    this.scene.add(mesh);
    await mesh.initialized;
    if (this.disposed) return;
    this.start();
  }

  goTo(view: Viewpoint, instant = false) {
    this.controls.setViewpoint(view, instant);
  }

  start() {
    this.running = true;
    this.updateLoop();
  }

  private updateLoop = () => {
    if (this.disposed) return;
    const active = this.running && (this.xrSession !== null || (this.onScreen && document.visibilityState === "visible"));
    this.renderer.setAnimationLoop(active ? this.frame : null);
    if (active) this.timer.reset(); // évite un saut après une pause
  };

  private frame = (time: number) => {
    this.timer.update(time);
    const dt = Math.min(this.timer.getDelta(), 0.1);
    if (this.xrSession) this.updateXrMovement(dt);
    else this.controls.update(dt);
    this.renderer.render(this.scene, this.camera);
  };

  // ── Réalité virtuelle (WebXR) ───────────────────────────────────────────

  /** Vrai si un casque VR est disponible (navigateur du casque, ou PC + casque). */
  static async vrSupported(): Promise<boolean> {
    try {
      return (await navigator.xr?.isSessionSupported("immersive-vr")) ?? false;
    } catch {
      return false;
    }
  }

  async enterVr() {
    if (!navigator.xr || this.xrSession) return;
    const session = await navigator.xr.requestSession("immersive-vr", { optionalFeatures: ["local-floor"] });
    this.renderer.xr.setReferenceSpaceType("local-floor");
    await this.renderer.xr.setSession(session);
    this.xrSession = session;
    // Le rig reprend la position et l'orientation courantes, au niveau du sol.
    this.rig.position.set(this.controls.position.x, 0, this.controls.position.z);
    this.rig.rotation.set(0, this.controls.yaw, 0);
    this.camera.position.set(0, 0, 0);
    this.camera.rotation.set(0, 0, 0);
    this.controls.enabled = false;
    session.addEventListener("end", this.onXrEnd);
    this.updateLoop();
    this.onXrChange?.(true);
  }

  exitVr() {
    void this.xrSession?.end();
  }

  private onXrEnd = () => {
    this.xrSession = null;
    this.rig.position.set(0, 0, 0);
    this.rig.rotation.set(0, 0, 0);
    this.controls.enabled = true;
    this.controls.update(0);
    this.updateLoop();
    this.onXrChange?.(false);
  };

  /** Manettes : stick gauche pour avancer / se décaler, stick droit pour tourner par paliers de 30°. */
  private updateXrMovement(dt: number) {
    if (!this.xrSession) return;
    const head = this.renderer.xr.getCamera();
    const forward = new THREE.Vector3();
    head.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(-forward.z, 0, forward.x);
    for (const source of this.xrSession.inputSources) {
      const axes = source.gamepad?.axes;
      if (!axes || axes.length < 4) continue;
      const x = Math.abs(axes[2] ?? 0) > 0.15 ? (axes[2] ?? 0) : 0;
      const y = Math.abs(axes[3] ?? 0) > 0.15 ? (axes[3] ?? 0) : 0;
      if (source.handedness === "right") {
        if (Math.abs(x) > 0.7 && this.snapReady) {
          this.rig.rotation.y -= Math.sign(x) * (Math.PI / 6);
          this.snapReady = false;
        } else if (Math.abs(x) < 0.3) {
          this.snapReady = true;
        }
      } else {
        this.rig.position.addScaledVector(forward, -y * 1.4 * dt).addScaledVector(right, x * 1.4 * dt);
        const { min, max } = this.bounds;
        this.rig.position.x = THREE.MathUtils.clamp(this.rig.position.x, min[0], max[0]);
        this.rig.position.z = THREE.MathUtils.clamp(this.rig.position.z, min[2], max[2]);
      }
    }
  }

  private resize() {
    const { clientWidth: w, clientHeight: h } = this.container;
    if (w === 0 || h === 0) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // Champ de vision élargi en portrait (mobile) pour garder une sensation d'espace.
    this.camera.fov = w / h < 1 ? 82 : 70;
    this.camera.updateProjectionMatrix();
  }

  private readonly raycaster = new THREE.Raycaster();

  private pick(ndc: THREE.Vector2): THREE.Vector3 | null {
    if (!this.mesh) return null;
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits: THREE.Intersection[] = [];
    this.mesh.raycast(this.raycaster, hits);
    hits.sort((a, b) => a.distance - b.distance);
    return hits[0]?.point ?? null;
  }

  /** Libère toutes les ressources GPU et les écouteurs. */
  dispose() {
    this.disposed = true;
    void this.xrSession?.end().catch(() => {});
    this.renderer.setAnimationLoop(null);
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    document.removeEventListener("visibilitychange", this.updateLoop);
    this.controls.dispose();
    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.dispose();
      this.mesh = null;
    }
    this.scene.remove(this.spark);
    this.spark.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}

/** WebGL2 est requis par Spark. */
export function supportsWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    const ok = !!gl;
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return ok;
  } catch {
    return false;
  }
}
