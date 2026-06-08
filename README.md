# Nounou IA

Application mobile pour gérer le planning d'une assistante maternelle : calendrier, jours de garde, absences, congés, repas, indemnités et calcul mensuel.

## Version actuelle

V1 fonctionne directement sur GitHub Pages, sans serveur.

Fonctions déjà prêtes :

- calendrier mensuel
- calendrier annuel avec couleurs
- ajout / modification / suppression d'une journée
- jours habituels du contrat
- remplissage automatique du mois
- tarif horaire net
- indemnité d'entretien
- repas
- absences enfant
- absences assistante maternelle
- congés
- calcul automatique du mois
- export CSV
- impression / PDF depuis le téléphone
- sauvegarde JSON
- import sauvegarde JSON
- assistant local qui comprend des phrases simples
- base prête pour brancher un serveur OpenAI plus tard

## Déploiement GitHub Pages

1. Ouvre le dépôt sur GitHub.
2. Va dans **Settings**.
3. Va dans **Pages**.
4. Dans **Build and deployment**, choisis **Deploy from a branch**.
5. Choisis la branche **main**.
6. Choisis le dossier **/root**.
7. Appuie sur **Save**.

L'application sera ensuite disponible à cette adresse :

```text
https://chasmet.github.io/nounou-ia/
```

## Utilisation rapide

1. Va dans **Réglages**.
2. Mets le prénom de l'enfant, le nom de l'assistante maternelle et les tarifs.
3. Coche les jours habituels de garde.
4. Va dans **Accueil**.
5. Appuie sur **Remplir le mois avec les jours habituels**.
6. Modifie les jours particuliers depuis le calendrier.
7. Utilise **Créer PDF / imprimer** pour faire le récapitulatif mensuel.

## Assistant IA

La V1 contient un assistant local. Il fonctionne sans API avec des phrases simples :

```text
Ajoute demain de 8h à 17h30
Warrel absent le 12/06
Nounou en congé du 15/07 au 19/07
Combien je dois payer ce mois-ci ?
```

Pour connecter ChatGPT réellement, il faudra ajouter un petit backend qui protège la clé OpenAI. L'application possède déjà un champ **URL serveur IA optionnel** dans les réglages.

## Roadmap

### V2

- contrats mensualisés
- calcul congés payés
- heures complémentaires / majorées
- jours fériés
- vacances scolaires saisissables par zone
- export PDF plus propre

### V3

- serveur OpenAI
- vraie mémoire IA
- résumé Pajemploi avancé
- messages automatiques à envoyer à la nounou
- comparateur de scénarios : 4 jours / 5 jours / 80 %

### V4

- compte utilisateur
- sauvegarde cloud Supabase
- plusieurs enfants
- documents du contrat
- signature mensuelle
