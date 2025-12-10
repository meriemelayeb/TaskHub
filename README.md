# TaskHub - Tableau de bord de gestion de tâches

TaskHub est une application web développée avec **Angular** qui permet de gérer les tâches, les réunions et d’analyser la performance des employés à travers un tableau de bord interactif. L’application inclut des KPIs.

---

## Table des matières
1. [Fonctionnalités](#fonctionnalités)
2. [Installation](#installation)
3. [Structure du projet](#structure-du-projet)
4. [Technologies utilisées](#technologies-utilisées)

---

## Fonctionnalités
- **Gestion des réunions**
  - Ajout, modification et suppression de réunions.
  - Statut des réunion : Prévue, Annulée, Terminée.
- **Gestion des tâches**
  - Ajout, modification et suppression de tâches.
  - Statut des tâches : À faire, En cours, Terminée.
- **Tableau de bord (Dashboard)**
  - KPIs : nombre total de tâches, tâches par statut, charge moyenne par employé.
  - Réunions de la semaine.
- **Graphiques**
  - Diagramme circulaire (pie chart) pour visualiser la répartition des tâches par statut.
- **Responsive Design**
  - Adaptation à tous types d’écrans.


## Installation

1. **Cloner le dépôt :**

```bash
git clone https://github.com/ton-username/TaskHub.git
cd TaskHub 
````
2. **Installer les dépendances :**
```bash
npm install
````
3. **Lancer l’application :**
```bash
ng serve
````

## Technologies utilisées

- Angular (Components, Services, TypeScript)

- Chart.js pour les graphiques

- HTML5 & CSS3 pour le design

- localStorage pour stocker les données en local