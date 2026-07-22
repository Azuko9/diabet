# Guide Repas Diététique — Centre Hospitalier de Pau

Application HTML/JS statique permettant de composer un plateau-repas équilibré (petit-déjeuner, déjeuner, goûter, dîner).

## Structure du projet

```
.
├── index.html                       # Page finale (générée par `npm run build`, ignorée par git)
├── js/app.js                        # Logique de sélection des aliments et de l'onglet actif
├── src/
│   ├── index.template.html          # Squelette de la page (head, header, main, script)
│   ├── partials/                    # Sections HTML sources, une par repas + le header
│   │   ├── header.html
│   │   ├── petit-dejeuner.html
│   │   ├── dejeuner.html
│   │   ├── gouter.html
│   │   └── diner.html
│   └── input.css                    # Styles Tailwind + styles custom (source)
├── css/output.css                   # CSS compilé (généré par `npm run build`, ignoré par git)
├── scripts/build-html.js            # Assemble index.template.html + partials → index.html
├── package.json
└── .github/workflows/deploy.yml     # Déploiement automatique sur GitHub Pages
```

`index.template.html` inclut chaque partial via un commentaire `<!-- INCLUDE:nom-du-fichier.html -->`, remplacé au build par le contenu du fichier correspondant dans `src/partials/`.

## Développement local

Prérequis : [Node.js](https://nodejs.org/) (v18+).

```bash
npm install
npm run build      # génère index.html + css/output.css
npm run watch:css  # recompile css/output.css à chaque modification de src/input.css
```

`index.html` n'est pas généré automatiquement quand on modifie `src/partials/*.html` ou `src/index.template.html` : relancer `npm run build` (ou `npm run build:html`) après ces changements.

Puis ouvrir `index.html` dans un navigateur (ou servir le dossier avec `npx serve`).

## Build de production

```bash
npm run build
```

Régénère `index.html` à partir des sources dans `src/`, et compile `css/output.css` minifié à partir de `src/input.css`.

## Déploiement

Le déploiement est entièrement automatisé via **GitHub Actions** (`.github/workflows/deploy.yml`) :

1. À chaque push sur `main`, le workflow installe les dépendances, régénère `index.html` et compile le CSS Tailwind, puis publie `index.html`, `css/output.css` et `js/app.js` sur **GitHub Pages**.
2. Aucun fichier généré (`node_modules/`, `index.html`, `css/output.css`) n'est commité dans le dépôt : tout est reconstruit à chaque déploiement.

### Activer GitHub Pages (une seule fois)

Dans les paramètres du dépôt GitHub : **Settings → Pages → Build and deployment → Source : GitHub Actions**.
