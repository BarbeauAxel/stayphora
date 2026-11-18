// Module vide utilisé À LA PLACE de three.js et Spark dans le bundle serveur
// (voir `turbopack.resolveAlias` dans next.config.ts). Le viewer 3D n'est
// jamais exécuté côté serveur ; ce stub évite d'alourdir le Worker de ~1 Mo.
module.exports = {};
