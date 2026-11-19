# Stayphora

Site vitrine de **Stayphora** : visites 3D navigables, générées par IA (Gaussian Splatting) à partir d'une
simple vidéo filmée au smartphone, pour les locations courte durée.
Domaine : https://stayphora.fr

- **Next.js 16** (App Router, TypeScript strict) : toutes les pages sont statiques (SSG), sauf `/api/devis`
- **Tailwind CSS v4** (tokens dans `app/globals.css`, bloc `@theme`), **Motion**, **lucide-react**
- **Viewer 3D** : [Spark](https://sparkjs.dev) (`@sparkjsdev/spark`) + three.js, chargés **à la demande uniquement**
- **react-hook-form + zod**, **Resend** (API REST), **Cloudflare Turnstile**
- Hébergement : **Cloudflare Workers** via **`@opennextjs/cloudflare`** ; scènes 3D sur **Cloudflare R2**

### Pourquoi Spark ?

| | Spark (World Labs) | GaussianSplats3D (mkkellogg) |
|---|---|---|
| Dernière version | 2.4.0 (octobre 2026) | 0.4.7 (janvier 2025) |
| Maintenance | active | plus de nouvelle version depuis début 2025 |
| Formats | .spz, .ply, .splat, .ksplat, .sog | .ply, .splat, .ksplat |
| Mobile | conçu pour les appareils peu puissants (tri en worker WASM) | correct, plus lourd |

Spark est le plus actif, lit le format **.spz** (le plus compact : ~14 octets par splat) et cible
explicitement les mobiles. Licence MIT.

---

## Démarrage

```bash
npm install
cp .dev.vars.example .dev.vars   # secrets serveur en local (clés de test Turnstile déjà renseignées)
cp .env.example .env             # variables de build (Turnstile, URL des assets)
npm run dev                      # http://localhost:3000
```

En local, laissez `NEXT_PUBLIC_ASSETS_URL` vide : les scènes sont lues dans `public/demo/tours/`
(dossier ignoré par git et non déployé, voir `public/demo/README.md`).

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement (avec accès aux bindings Cloudflare) |
| `npm run build` | Build Next.js seul |
| `npm run preview` | Build OpenNext + exécution locale dans le runtime Workers (http://localhost:8787) |
| `npm run deploy` | Build OpenNext + déploiement sur Cloudflare |
| `npm run size` | Build + taille du Worker (ligne `Total Upload … / gzip: …`, limite gratuite : 3 Mio) |
| `npm run cf-typegen` | Régénère `cloudflare-env.d.ts` après une modification de `wrangler.jsonc` |
| `npm run typecheck` | Vérification TypeScript |

> **Taille du Worker : ~2,1 Mio compressés** (limite du plan gratuit : 3 Mio). three.js et Spark sont
> exclus du bundle serveur par `turbopack.resolveAlias` (`next.config.ts`) : ils n'existent que
> côté navigateur. Lancez `npm run size` après chaque ajout de dépendance.
>
> `npm run preview` n'envoie pas `public/demo/` (exclu par `public/.assetsignore`) : pour tester la visite
> en preview, renseignez `NEXT_PUBLIC_ASSETS_URL` avec l'URL de votre bucket R2 avant le build.

---

## Organisation

```
app/(site)/             pages du site (accueil, guide de tournage, pages légales) + header/footer
app/demo/[slug]/        visite plein écran (une page statique par visite), intégrable en iframe
app/api/devis/route.ts  formulaire : rate limit → honeypot → Turnstile → zod → Resend
components/tour/        viewer 3D : TourPlayer (léger), TourViewer (à la demande), engine, controls
components/sections/    une section de la page d'accueil par fichier
components/ui/          composants réutilisables
content/fr/             TOUS les textes, visites, prix, FAQ, guide (typés par content/types.ts)
lib/                    schéma zod partagé, emails, Turnstile, URL des assets
```

**Modifier un texte** : tout est dans `content/fr/*.ts`. Dans les titres, un mot entre astérisques est en
italique (`"Faites visiter votre location *avant* l'arrivée."`).

**Ajouter l'anglais** : créer `content/en/` sur le modèle de `content/fr/` (TypeScript signale les clés
manquantes) et le brancher dans `content/index.ts`.

### Le viewer 3D

- `TourPlayer` (chargé avec la page) affiche la couverture et le bouton « Explorer le logement ».
  Au clic, il télécharge `TourViewer` (three.js + Spark, ~1 Mo) puis la scène, avec une barre de progression réelle.
- **Contrôles** : glisser pour regarder, molette ou pincement pour avancer, flèches / ZQSD / WASD,
  deux doigts pour se déplacer, double-clic ou double-tap pour aller vers un point. Mouvements amortis,
  déplacement limité à la zone `bounds` de la visite.
- **Interface** : pièces, visite guidée (coupes franches si « réduire les animations » est activé),
  plein écran (repli CSS sur iPhone), aide, crédit de la scène. Un bouton VR (WebXR) n'apparaît que si un
  casque est détecté ; il n'est pas mis en avant sur le site.
- **Performance** : pixel ratio plafonné (1,25 sur mobile), version allégée de la scène sur les écrans
  tactiles, rendu en pause hors écran ou onglet caché, mémoire WebGL libérée à la fermeture.
- **Repli** : sans WebGL 2 (ou appareil < 2 Go de mémoire), la vidéo de la visite est proposée.
- **`?debug`** : sur `/demo/<slug>?debug`, la position de la caméra s'affiche en bas de l'écran,
  prête à copier dans `content/fr/tours.ts`.

> **VR** : le mode WebXR (bouton « VR », sticks pour se déplacer) n'a pas pu être testé sur un vrai casque.
> Testez-le sur un Meta Quest (navigateur du casque) avant de le mettre en avant.

---

## Ajouter une nouvelle visite

1. **Reconstruire la scène** à partir des vidéos (Postshot, Scaniverse, Luma, Polycam, SplatCast, nerfstudio…)
   puis l'exporter en **.ply**.
2. **Nettoyer et compresser** avec [SuperSplat](https://superspl.at/editor) : supprimer les « flotteurs »,
   recadrer le logement, mettre le sol à l'horizontale (axe Y vers le haut, sol à y = 0), puis exporter.
   Formats acceptés par Spark : **.spz** (recommandé), .ply (compressé ou non), .splat, .ksplat, .sog.
   Visez ≤ 1 million de splats (~15 Mo) et une version mobile ≤ 500 000 splats (~7 Mo).
   Conversion PLY → SPZ : `npx @playcanvas/splat-transform scene.ply scene.spz` (ou l'outil `spz` de Niantic).
3. **Envoyer dans R2** :
   ```bash
   npx wrangler r2 object put stayphora-assets/tours/<slug>.spz --file <slug>.spz \
     --content-type application/octet-stream --cache-control "public, max-age=31536000, immutable" --remote
   npx wrangler r2 object put stayphora-assets/tours/<slug>-mobile.spz --file <slug>-mobile.spz \
     --content-type application/octet-stream --cache-control "public, max-age=31536000, immutable" --remote
   ```
   (Pour remplacer une scène déjà en ligne, changez le nom du fichier : elle est mise en cache un an.)
   En local, copiez les mêmes fichiers dans `public/demo/tours/`.
4. **Déclarer la visite** dans `content/fr/tours.ts` : `slug`, `title`, `location`, `kind`, `area`,
   `scene: "tours/<slug>.spz"`, `sceneMobile`, `cover`, `bounds` (zone de déplacement, en mètres), `rooms`.
5. **Définir les points de vue** : `npm run dev`, ouvrez `/demo/<slug>?debug`, placez-vous, copiez la ligne
   affichée (`{ label: "…", position: [...], target: [...] }`) dans `rooms`. La première pièce est le point de départ.
6. **Couverture** : une capture de la scène (1600 × 1200, JPEG) dans `public/images/tours/<slug>.jpg`.
   Facultatif : une vidéo de survol (`video`) pour le repli sans WebGL.
7. La page `/demo/<slug>`, le sitemap, la grille des réalisations et les vignettes de la démo se mettent à jour seuls.

**Code d'intégration à livrer au client** :
```html
<iframe src="https://stayphora.fr/demo/<slug>" width="100%" height="600" style="border:0;border-radius:16px"
  allow="fullscreen; xr-spatial-tracking" loading="lazy" title="Visite 3D"></iframe>
```
Les pages `/demo/*` autorisent l'intégration sur n'importe quel site (`frame-ancestors *`) ; le reste du site non.

---

## Vidéo du hero et vidéos de visite

La vidéo du hero est un enregistrement d'écran d'une visite (déplacement lent). Contraintes : 1080p max,
10 à 20 s, **moins de 4 Mo** chacune. Les vidéos actuelles ont été enregistrées depuis le viewer avec la
démo d'exemple ; remplacez-les par une de **vos** visites.

```bash
# Enregistrez l'écran pendant une visite (OBS, QuickTime…), puis :
# WebM (VP9), servi en priorité
ffmpeg -i capture.mov -ss 2 -t 15 -vf "scale=-2:1080,fps=30" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 36 -row-mt 1 -deadline good -cpu-used 2 public/videos/hero.webm
# MP4 (H.264), pour Safari
ffmpeg -i capture.mov -ss 2 -t 15 -vf "scale=-2:1080,fps=30" -an \
  -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -movflags +faststart public/videos/hero.mp4
# Poster (première image), image LCP du hero
ffmpeg -i public/videos/hero.mp4 -frames:v 1 -vf "scale=2400:-2" -q:v 3 public/images/hero-poster.jpg
```

Trop lourd ? Augmentez `-crf` de 2 à 4, passez en 720p (`scale=-2:720`) ou raccourcissez (`-t 12`).
La vidéo n'est jamais chargée si le visiteur préfère moins d'animations ou économise ses données.
Les fichiers de `public/images` et `public/videos` sont mis en cache un an : **changez le nom** pour remplacer.

---

## Variables et secrets

| Nom | Type | Où le définir |
|---|---|---|
| `RESEND_API_KEY` | secret serveur | Prod : `npx wrangler secret put RESEND_API_KEY` · Local : `.dev.vars` |
| `TURNSTILE_SECRET_KEY` | secret serveur | Prod : `npx wrangler secret put TURNSTILE_SECRET_KEY` · Local : `.dev.vars` |
| `CONTACT_EMAIL_TO` | variable serveur | `vars` dans `wrangler.jsonc` (adresse qui reçoit les demandes) |
| `CONTACT_EMAIL_FROM` | variable serveur | `vars` dans `wrangler.jsonc` (expéditeur, domaine vérifié dans Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | variable **de build** | Local : `.env` · Workers Builds : *Settings → Build → Variables and secrets* |
| `NEXT_PUBLIC_ASSETS_URL` | variable **de build** | `https://assets.stayphora.fr` en production (vide en local) ; utilisée aussi par la CSP |

Clés de **test** Turnstile : site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

---

## Mise en production

### 1. Bucket R2 pour les scènes 3D
```bash
npx wrangler login
npx wrangler r2 bucket create stayphora-assets
# Domaine public assets.stayphora.fr (zone stayphora.fr active sur Cloudflare ; Zone ID visible
# dans le dashboard, page d'accueil de la zone, colonne de droite)
npx wrangler r2 bucket domain add stayphora-assets --domain assets.stayphora.fr --zone-id <ZONE_ID> --min-tls 1.2
# CORS : autorise stayphora.fr à lire les scènes (fichier fourni à la racine du projet)
npx wrangler r2 bucket cors set stayphora-assets --file r2-cors.json
# Envoi des scènes d'exemple (fichiers de public/demo/tours)
for f in appartement appartement-mobile riverview riverview-mobile; do
  npx wrangler r2 object put stayphora-assets/tours/$f.spz --file public/demo/tours/$f.spz \
    --content-type application/octet-stream --cache-control "public, max-age=31536000, immutable" --remote
done
```
Équivalent dashboard : **R2 → Create bucket** ; **Settings → Custom Domains → Connect domain** ;
**Settings → CORS policy → Add** (coller le contenu de `r2-cors.json`).
Vérification : `curl -I -H "Origin: https://stayphora.fr" https://assets.stayphora.fr/tours/appartement.spz`
doit renvoyer `200` et `Access-Control-Allow-Origin`.

### 2. Turnstile
Dashboard Cloudflare → **Turnstile** → **Add widget** : domaines `stayphora.fr` et `stayphora.com`,
mode **Managed**. Récupérez la **Site Key** (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`) et la **Secret Key**
(`npx wrangler secret put TURNSTILE_SECRET_KEY`).

### 3. Resend : domaine d'envoi
1. resend.com → **Domains** → **Add domain** → `stayphora.fr` (région UE recommandée).
2. Ajoutez dans Cloudflare (**DNS → Records**, en **DNS only**, nuage gris) les enregistrements fournis :
   **MX** `send` (bounces), **TXT** `send` = `v=spf1 include:amazonses.com ~all` (**SPF**),
   **TXT** `resend._domainkey` (**DKIM**) ; recommandé : **TXT** `_dmarc` = `v=DMARC1; p=none; rua=mailto:contact@stayphora.fr`.
3. **Verify** dans Resend, puis créez une clé API (*Sending access*) → `npx wrangler secret put RESEND_API_KEY`.

### 4. Déployer
**Depuis votre poste** (`.env` contenant les vraies `NEXT_PUBLIC_*`) :
```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
npm run deploy
```
**Ou via GitHub (Workers Builds)** : dashboard → **Workers & Pages** → **Create** → **Import a repository**
→ `BarbeauAxel/stayphora`.
- Build command : `npx opennextjs-cloudflare build` · Deploy command : `npx opennextjs-cloudflare deploy`
- *Settings → Build → Variables and secrets* : `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_ASSETS_URL`
- *Settings → Variables and secrets* (runtime) : `RESEND_API_KEY`, `TURNSTILE_SECRET_KEY` (type **Secret**)
- Nom du Worker : `stayphora`

### 5. Domaine personnalisé
Les `routes` `custom_domain` de `wrangler.jsonc` rattachent `stayphora.fr` et `www.stayphora.fr` au Worker
au déploiement (DNS et certificat créés automatiquement). Supprimez d'abord tout enregistrement A/CNAME
existant sur ces noms. Équivalent manuel : Worker → **Settings → Domains & Routes → Add → Custom domain**.

### 6. Redirections 301
Zone **stayphora.fr** → **Rules → Redirect Rules → Create rule** :
- Filtre : `(http.host eq "www.stayphora.fr")`
- Action : **Dynamic**, `concat("https://stayphora.fr", http.request.uri.path)`, **301**, *Preserve query string*.

Zone **stayphora.com** (ajoutée à Cloudflare) :
1. DNS : `AAAA @ → 100::` et `AAAA www → 100::`, **proxifiés** (nuage orange).
2. Redirect Rule : `(http.host eq "stayphora.com") or (http.host eq "www.stayphora.com")` →
   **Dynamic** `concat("https://stayphora.fr", http.request.uri.path)`, **301**, *Preserve query string*.

Les Redirect Rules s'exécutent avant le Worker.

### 7. Vérifications
- Envoyer une demande de devis de test : email interne + confirmation (avec le guide de tournage).
- Lancer une visite sur mobile et sur ordinateur ; `/demo/appartement` en plein écran.
- `curl -I https://www.stayphora.fr` → `301` vers `https://stayphora.fr/`.
- Logs : Worker → **Observability**.

---

## Crédits des scènes d'exemple

Les visites « Appartement » et « Loft » et la photo « Ce que vous filmez » proviennent du jeu de données
[Eyeful Tower](https://github.com/facebookresearch/EyefulTower) (© Meta Platforms, Inc. et affiliés,
**licence MIT** depuis le 11 mars 2026), entraînées avec SplatCast
([splatcast/sample-scenes](https://huggingface.co/datasets/splatcast/sample-scenes)), puis converties en .spz,
recadrées et allégées pour le web. Le crédit est affiché dans chaque visite (icône ⓘ).
Les textes de licence sont dans `public/demo/licences/` (local) ; à remplacer par vos propres scans.
