# Vérification du package à 10 colonnes

- `sync_data.py` lit uniquement la feuille « Suivi simplifié » pour les activités ; il ignore « Activités » (archive).
- 71 activités régénérées ; identifiants et groupes contrôlés à la synchronisation.
- `app.js` ne rend plus Fondement, Preuve, Informations nécessaires ni Échéance initiale.
- JavaScript vérifié avec `node --check`.
- HTML de prévisualisation autonome (CSS, données et code embarqués).
- Tests interactifs réels sur l'appareil de l'utilisateur : encore à effectuer.
