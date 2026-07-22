# Guide Repas Diététique — Centre Hospitalier de Pau

Application HTML/JS statique permettant de composer un plateau-repas équilibré (petit-déjeuner, déjeuner, goûter, dîner).

## Structure du projet

```
.
├── index.html              # Page principale
├── js/app.js                # Logique de sélection des aliments et de l'onglet actif
├── src/input.css             # Styles Tailwind + styles custom (source)
├── css/output.css            # CSS compilé (généré par `npm run build`, ignoré par git)
├── package.json
└── .github/workflows/deploy.yml   # Déploiement automatique sur GitHub Pages
```

## Développement local

Prérequis : [Node.js](https://nodejs.org/) (v18+).

```bash
npm install
npm run watch   # recompile css/output.css à chaque modification
```

Puis ouvrir `index.html` dans un navigateur (ou servir le dossier avec `npx serve`).

## Build de production

```bash
npm run build
```

Génère `css/output.css` minifié à partir de `src/input.css`.

## Déploiement

Le déploiement est entièrement automatisé via **GitHub Actions** (`.github/workflows/deploy.yml`) :

1. À chaque push sur `main`, le workflow installe les dépendances, compile le CSS Tailwind puis publie `index.html`, `css/output.css` et `js/app.js` sur **GitHub Pages**.
2. Aucun fichier généré (`node_modules/`, `css/output.css`) n'est commité dans le dépôt : tout est reconstruit à chaque déploiement.

### Activer GitHub Pages (une seule fois)

Dans les paramètres du dépôt GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
