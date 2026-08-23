# On se voix ? — web app

Web app du podcast "On se voix ?" : écouter le podcast, faire une décla, participer.

## Prérequis

- [Node.js](https://nodejs.org/) version 18 ou plus récente (inclut `npm`).

## Installation

```bash
npm run install:all
```

Ceci installe les dépendances à la racine, dans `client/` et dans `server/`.

## Configuration (optionnelle pour commencer)

Copiez `server/.env.example` en `server/.env` et remplissez vos identifiants Airtable
(`AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, noms de tables). **Sans ce fichier, l'app
fonctionne quand même** : le serveur simule les envois (ils sont juste loggés dans la
console) au lieu de les envoyer réellement à Airtable — pratique pour tester en local.

## Lancer le projet en local

```bash
npm run dev
```

- Le serveur Express démarre sur http://localhost:3001
- Le client React démarre sur http://localhost:5173 (ouvrez cette URL dans votre navigateur)

## À compléter avant mise en ligne

- Lien TikTok dans `client/src/data/links.js`.
- Clé API Airtable (`server/.env`) avec le scope `schema.bases:read` en plus de
  `data.records:read`/`write`, pour que la liste des célibataires soit lue en direct
  depuis le champ Airtable (sinon la liste de secours dans
  `client/src/data/celibataires.js` est utilisée).
- Créer la table "Participations" dans Airtable si elle n'existe pas encore, avec les
  champs `Prénom`, `Ville`, `Âge`, `Email`, `Instagram`, et un champ pièce jointe nommé
  `Vocal`.
- Texte "À propos" dans `client/src/pages/APropos.jsx` (une version de démarrage a été
  rédigée à partir de la bio Instagram, à ajuster librement).
- Le logo dans `client/public/logo.jpg` est la photo de profil Instagram en basse
  résolution (150×150) — à remplacer par un fichier logo haute qualité si vous en avez un.
