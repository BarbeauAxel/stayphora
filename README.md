# Stayphora

Site vitrine de **Stayphora** : rendus de décoration intérieure par IA pour les locations courte durée.
Domaine : https://stayphora.fr

- **Next.js 16** (App Router, TypeScript strict), toutes les pages sont statiques (SSG), sauf `/api/devis`
- **Tailwind CSS v4** (tokens dans `app/globals.css`, bloc `@theme`)
- **Motion** (`motion/react`, chargé via `LazyMotion`), **lucide-react**, **react-hook-form + zod**
- **Resend** (API REST) pour les emails, **Cloudflare Turnstile** contre le spam
- Hébergement sur **Cloudflare Workers** via **`@opennextjs/cloudflare`**

---

## Démarrage

```bash
npm install
cp .dev.vars.example .dev.vars   # secrets serveur en local (clés de test Turnstile déjà renseignées)
cp .env.example .env             # clé de site Turnstile (lue au build)
npm run dev                      # http://localhost:3000
```

| Script | Rôle |
|---|---|
| `npm run dev` | Serveur de développement Next.js (avec accès aux bindings Cloudflare) |
| `npm run build` | Build Next.js seul |
| `npm run preview` | Build OpenNext + exécution locale dans le runtime Workers (http://localhost:8787) |
| `npm run deploy` | Build OpenNext + déploiement sur Cloudflare |
| `npm run size` | Build + mesure de la taille du Worker (ligne `Total Upload … / gzip: …`) |
| `npm run cf-typegen` | Régénère `cloudflare-env.d.ts` après une modification de `wrangler.jsonc` |
| `npm run typecheck` | Vérification TypeScript |

> **Taille du Worker** : environ 2,0 Mio compressés pour une limite de 3 Mio sur le plan Workers gratuit.
> Lancez `npm run size` après chaque ajout de dépendance. Environ 0,6 Mio provient de `next/og`
> (favicon et image Open Graph). En cas de besoin, on peut le supprimer en remplaçant `app/icon.tsx`
> et `app/opengraph-image.tsx` par des fichiers `app/icon.png` et `app/opengraph-image.png`.

> **Windows** : OpenNext recommande WSL. Le build et le preview fonctionnent nativement ici, mais si une
> erreur étrange apparaît pendant `opennextjs-cloudflare build`, essayez depuis WSL.

---

## Organisation

```
app/                    routes (page d'accueil, pages légales, 404, SEO, API)
app/api/devis/route.ts  traitement du formulaire (Turnstile → zod → Resend)
components/sections/    une section de page par fichier
components/ui/          composants réutilisables (Button, Container, SectionHeading,
                        Accordion, BeforeAfterSlider, Modal, Turnstile, Logo…)
content/                TOUS les textes, prix, FAQ, projets, styles (typés)
  types.ts              forme du contenu (une langue = un objet `Content`)
  fr/                   contenu français
lib/                    schémas zod partagés, compression d'images, emails, Turnstile
public/                 images, vidéos, _headers
assets/fonts/           TTF Instrument Serif (licence OFL), utilisées uniquement par next/og au build
```

**Modifier un texte** : tout se trouve dans `content/fr/*.ts`. Dans les titres, un mot entre
astérisques est affiché en italique, par exemple `"Voyez votre location *sublimée* avant d'investir."`.

**Ajouter l'anglais (stayphora.com)** : créez `content/en/` sur le modèle de `content/fr/`
(TypeScript signale les clés manquantes) et branchez-le dans `content/index.ts`. Ensuite, soit
déployez un second Worker pour stayphora.com avec la langue `en`, soit ajoutez un segment `app/[locale]`.

---

## Vidéo du hero

Contraintes : 1080p maximum, 10 à 20 s, **moins de 4 Mo** (les static assets Workers sont limités à 25 Mio par fichier).
Déposez les fichiers dans `public/videos/`, puis passez `hero.video.enabled` à `true` dans `content/fr/home.ts`.

```bash
# WebM (VP9) : le plus léger, servi en priorité
ffmpeg -i source.mp4 -t 15 -vf "scale=-2:1080,fps=25" -an \
  -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 -deadline good -cpu-used 2 \
  public/videos/hero.webm

# MP4 (H.264) : compatibilité Safari / iOS
ffmpeg -i source.mp4 -t 15 -vf "scale=-2:1080,fps=25" -an \
  -c:v libx264 -preset slow -crf 28 -profile:v high -pix_fmt yuv420p -movflags +faststart \
  public/videos/hero.mp4

# Poster (première image), utilisé comme image LCP
ffmpeg -i source.mp4 -ss 0 -frames:v 1 -vf "scale=2400:-2" -q:v 3 public/images/hero-poster.jpg
```

Si un fichier dépasse 4 Mo, augmentez `-crf` (+2 à +4), réduisez à 720p (`scale=-2:720`) ou raccourcissez (`-t 12`).
La vidéo n'est jamais chargée si le visiteur préfère moins d'animations (`prefers-reduced-motion`)
ou économise ses données (`saveData`). Seul le poster est alors affiché.

> Les fichiers de `public/images` et `public/videos` sont mis en cache un an (`public/_headers`).
> **Pour remplacer un fichier déjà en ligne, donnez-lui un nouveau nom** (ex. `hero-v2.mp4`)
> et mettez à jour le chemin dans `content/`.

---

## Variables et secrets

| Nom | Type | Où le définir |
|---|---|---|
| `RESEND_API_KEY` | secret serveur | Prod : `npx wrangler secret put RESEND_API_KEY` · Local : `.dev.vars` |
| `TURNSTILE_SECRET_KEY` | secret serveur | Prod : `npx wrangler secret put TURNSTILE_SECRET_KEY` · Local : `.dev.vars` |
| `CONTACT_EMAIL_TO` | variable serveur | `vars` dans `wrangler.jsonc` (adresse qui reçoit les demandes) |
| `CONTACT_EMAIL_FROM` | variable serveur | `vars` dans `wrangler.jsonc` (expéditeur, sur un domaine vérifié dans Resend) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | variable **de build** | Local : `.env` · Workers Builds : *Settings → Build → Variables and secrets* |

Clés de **test** Turnstile (déjà dans les fichiers d'exemple) :
site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA` (la vérification réussit toujours).

---

## Mise en production

### 1. Turnstile
1. Dashboard Cloudflare → **Turnstile** → **Add widget**.
2. Nom « Stayphora », domaines `stayphora.fr` et `stayphora.com`, mode **Managed**.
3. Récupérez la **Site Key** (pour `NEXT_PUBLIC_TURNSTILE_SITE_KEY`) et la **Secret Key** (pour `npx wrangler secret put TURNSTILE_SECRET_KEY`).

### 2. Resend : vérifier le domaine d'envoi
1. resend.com → **Domains** → **Add domain** → `stayphora.fr` (région UE recommandée).
2. Resend affiche les enregistrements DNS. Ajoutez-les dans Cloudflare (**DNS → Records**) en **DNS only** (nuage gris) :
   - **MX** `send` → `feedback-smtp.<région>.amazonses.com` (priorité 10) : retours de bounce
   - **TXT** `send` → `v=spf1 include:amazonses.com ~all` : **SPF**
   - **TXT** `resend._domainkey` → `p=MIGfMA0G…` : **DKIM** (valeur fournie par Resend)
   - Recommandé : **TXT** `_dmarc` → `v=DMARC1; p=none; rua=mailto:contact@stayphora.fr`
3. Cliquez sur **Verify** dans Resend (quelques minutes).
4. Créez une clé API (**API Keys**, permission *Sending access*) → `npx wrangler secret put RESEND_API_KEY`.
5. Vérifiez que `CONTACT_EMAIL_FROM` utilise ce domaine (ex. `Stayphora <devis@stayphora.fr>`).

### 3. Déployer
**Depuis votre poste :**
```bash
npx wrangler login
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put TURNSTILE_SECRET_KEY
# .env doit contenir la vraie NEXT_PUBLIC_TURNSTILE_SITE_KEY (lue au build)
npm run deploy
```

**Ou via GitHub avec Workers Builds :** dashboard → **Workers & Pages** → **Create** → **Import a repository**.
- Build command : `npx opennextjs-cloudflare build`
- Deploy command : `npx opennextjs-cloudflare deploy`
- *Settings → Build → Variables and secrets* : `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- *Settings → Variables and secrets* (runtime) : `RESEND_API_KEY` et `TURNSTILE_SECRET_KEY` en type **Secret**
- Le nom du Worker dans le dashboard doit être `stayphora` (comme dans `wrangler.jsonc`).

### 4. Domaine personnalisé
`stayphora.fr` doit être une zone active de votre compte Cloudflare (nameservers Cloudflare).
Les `routes` avec `custom_domain: true` de `wrangler.jsonc` rattachent `stayphora.fr` et `www.stayphora.fr`
au Worker lors du déploiement : Cloudflare crée les enregistrements DNS et le certificat.
(Équivalent manuel : Worker → **Settings → Domains & Routes → Add → Custom domain**.)
S'il existe déjà un enregistrement A/CNAME sur `stayphora.fr` ou `www`, supprimez-le d'abord.

### 5. Redirections 301 (www et stayphora.com)
Dans la zone **stayphora.fr** → **Rules → Redirect Rules → Create rule** :
- *Custom filter expression* : `(http.host eq "www.stayphora.fr")`
- *Then* : **Dynamic**, expression `concat("https://stayphora.fr", http.request.uri.path)`,
  code **301**, cochez **Preserve query string**.

Dans la zone **stayphora.com** (ajoutée à Cloudflare) :
1. DNS : enregistrements **proxifiés** (nuage orange) `AAAA @ → 100::` et `AAAA www → 100::`
   (adresse factice : la règle répond avant toute origine).
2. **Rules → Redirect Rules → Create rule** :
   - *Filter* : `(http.host eq "stayphora.com") or (http.host eq "www.stayphora.com")`
   - *Then* : **Dynamic**, `concat("https://stayphora.fr", http.request.uri.path)`, **301**, *Preserve query string*.

Les Redirect Rules s'exécutent avant le Worker, donc `www` est redirigé même s'il est rattaché au Worker.
(Quand la version anglaise existera, cette règle `.com` sera remplacée par un second Worker.)

### 6. Vérifications après déploiement
- Envoyer une demande de test avec 2 ou 3 photos, puis vérifier la réception et l'email de confirmation.
- `curl -I https://www.stayphora.fr` → `301` vers `https://stayphora.fr/`.
- Logs : dashboard → Worker → **Observability**.
- Lighthouse (mode navigation privée) sur https://stayphora.fr.
