# Formulaire d'Inscription - React + Vite

Projet de formulaire d'inscription en React avec Vite.

## Fonctionnalités

- Formulaire d'inscription : Prénom, Nom, Email, Date de naissance, Ville, Code postal
- Le bouton de sauvegarde est désactivé si les champs ne sont pas remplis
- Validation des champs avec affichage des erreurs en rouge sous chaque champ
- Sauvegarde dans le localStorage si le formulaire est valide
- Affichage d'un message de succès (toaster) et vidage des champs après sauvegarde
- Affichage d'un message d'erreur si invalide
- Règles de validation : date de naissance (blocage des -18 ans), code postal français, noms sans caractères spéciaux/chiffres mais accents acceptés.

## Lancement

```bash
npm install
npm run dev
```

## Tests

Couverture de 100%.

```bash
npm test
```
