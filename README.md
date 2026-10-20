# SIRA Guinée — Suivi opérationnel simplifié

La feuille **Suivi simplifié** (10 colonnes) est désormais la **seule source des activités** pour `sync_data.py` et `data.js`. La feuille historique **Activités** est conservée exclusivement comme archive : son contenu n'est ni synchronisé ni affiché. Les champs détaillés historiques ne figurent plus dans la fiche activité du tableau de bord.

Pour mettre à jour : renseigner **Suivi simplifié**, puis enregistrer le classeur et le remplacer sur GitHub. Le workflow exécute `sync_data.py` et régénère `data.js`. **Paramètres** contrôle la date de début et la durée, **Marchés prioritaires** reste séparée. Le jour du pacte est un entier de 1 à la durée ; laisser vide si la date n'est pas définie. Il n'y a pas de champ d'échéance fixe pour les activités dans cette version à 10 colonnes.

Les données de démonstration (dates et marchés) ne sont pas des engagements SIRA validés. Ne pas remplacer la version publiée sans revue fonctionnelle sur mobile et ordinateur.
