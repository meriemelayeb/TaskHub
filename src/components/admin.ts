import { Component, OnInit } from '@angular/core';
import { Task } from '../app/models/task';
import { Reunion } from '../app/models/reun';
import { LocalDbService } from '../app/services/db.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {

  userName: string = '';
  initials: string = '';

  taches: Task[] = [];
  reunions: Reunion[] = [];
  reunionsFiltrees: Reunion[] = [];

  // ================= CHAMPS DE SAISIE =================
  newTaskTitle: string = '';
  newTaskDesc: string = '';
  newTaskAssignedTo: string = '';  
  newTaskStatus: 'À faire' | 'En cours' | 'Terminée' = 'À faire';

  newReunionNom: string = '';
  newReunionDesc: string = '';
  newReunionDate: string = '';
  newReunionEtat: 'Prévue' | 'Annulée' | 'Terminée' = 'Prévue';

  constructor(private db: LocalDbService, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      this.userName = user.name || user.fullname || 'User';
      this.initials = this.userName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();
    }

    // Charger les données existantes
    this.taches = this.db.getTasks();
    this.reunions = this.db.getReunions();
    this.reunionsFiltrees = this.reunions;

    // Trier les réunions par date croissante par défaut
    this.reunionsFiltrees = this.reunions.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  }

  // ========================= TÂCHES =========================
  ajouterTacheManuel() {
    if (!this.newTaskTitle || !this.newTaskAssignedTo) {
      alert('Veuillez remplir le titre et l’employé assigné.');
      return;
    }

    // Récupérer les utilisateurs depuis le localStorage
    const usersJson = localStorage.getItem('users'); // la clé où tu stockes les utilisateurs
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Vérifier que l'employé existe
    const employeExiste = users.some((u: { name: string }) => u.name.toLowerCase() === this.newTaskAssignedTo.toLowerCase());

    if (!employeExiste) {
      alert(`L'employé "${this.newTaskAssignedTo}" n'existe pas.`);
      return;
    }

    // Créer la nouvelle tâche
    const newTask: Task = {
      id: Date.now(),
      title: this.newTaskTitle,
      description: this.newTaskDesc,
      assignedTo: this.newTaskAssignedTo,
      status: this.newTaskStatus,
      createdAt: new Date().toISOString(),
    };

    // Ajouter dans la base locale
    this.db.addTask(newTask);
    this.taches = this.db.getTasks();

    // Réinitialiser les champs
    this.newTaskTitle = '';
    this.newTaskDesc = '';
    this.newTaskAssignedTo = '';
    this.newTaskStatus = 'À faire';
  }

  supprimerTache(id: number) {
    this.db.deleteTask(id);
    this.taches = this.db.getTasks();
  }

  changeTaskStatus(tache: Task) {
    this.db.updateTaskStatus(tache.id, tache.status);
    this.taches = this.db.getTasks();

    console.log("Statut modifié :", tache);
  }
  // RÉUNIONS
  ajouterReunionManuel() {
    if (!this.newReunionNom || !this.newReunionDate) return;

    const newReunion: Reunion = {
      id: Date.now(),
      nom: this.newReunionNom,
      description: this.newReunionDesc,
      etat: this.newReunionEtat,
      date: this.newReunionDate,
     
    };

    this.db.addReunion(newReunion);
    this.reunions = this.db.getReunions();

    // Trier par date croissante
    this.reunionsFiltrees = this.reunions.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Reset champs
    this.newReunionNom = '';
    this.newReunionDesc = '';
    this.newReunionDate = '';
    this.newReunionEtat = 'Prévue';
    
  }

  supprimerReunion(id: number) {
    this.db.deleteReunion(id);
    this.reunions = this.db.getReunions();
    this.reunionsFiltrees = this.reunions;
  }
  changeReunionEtat(reunion: Reunion) {
    this.db.updateReunion(reunion);  
    this.reunions = this.db.getReunions();
    this.reunionsFiltrees = this.reunions;

    console.log("État de la réunion mis à jour :", reunion);
  }

  // ========================= FILTRE =========================
  filtrerPar(event: any) {
    const filtre = event.target.value;
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Début et fin de semaine
    const debutSemaine = new Date(now);
    debutSemaine.setDate(now.getDate() - now.getDay()); // dimanche
    debutSemaine.setHours(0, 0, 0, 0);

    const finSemaine = new Date(debutSemaine);
    finSemaine.setDate(debutSemaine.getDate() + 6);
    finSemaine.setHours(23, 59, 59, 999);

    // Filtrer les réunions
    const filtered = this.reunions.filter(r => {
      const reunionDate = new Date(r.date);
      reunionDate.setHours(0, 0, 0, 0); // ignore l’heure pour la comparaison
      switch (filtre) {
        case 'jour':
          return reunionDate.getTime() === today.getTime();

        case 'semaine':
          return reunionDate >= debutSemaine && reunionDate <= finSemaine;

        case 'mois':
          return (
            reunionDate.getMonth() === now.getMonth() &&
            reunionDate.getFullYear() === now.getFullYear()
          );

        default:
          return true; // 'all'
      }
    });

    // ✅ Trier par date croissante
    this.reunionsFiltrees = filtered.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}

  // convertir date "YYYY-MM-DD" en "JJ/MM/AAAA" pour affichage
  formatDateFR(date: Date | string): string {
    const d = new Date(date);

    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
}

  getReunionClass(etat: string) {
  switch (etat) {
    case 'Prévue':
      return 'badge-blue';
    case 'Annulée':
      return 'badge-red';
    case 'Terminée':
      return 'badge-green';
    default:
      return 'badge-grey';
    }
  }

  getTaskClass(status: string) {
    switch (status) {
      case 'À faire':
        return 'badge-orange';
      case 'En cours':
        return 'badge-blue';
      case 'Terminée':
        return 'badge-green';
      default:
        return 'badge-grey';
    }
  }
  goToDashboard() {
    // redirection vers le dashboard
    this.router.navigate(['/dashboard']);
  }

  logout() {
    // logique de déconnexion
    // par exemple, vider le localStorage et rediriger vers login
    localStorage.removeItem('user');
    this.router.navigate(['']);
  }

  // ========================= MODAL ÉDITION TÂCHE =========================
  showEditPopup: boolean = false;
  selectedTask: Task = {} as Task;

  openEditPopup(task: Task) {
    // on crée une copie pour éviter les changements directs
    this.selectedTask = { ...task };
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
  }

  saveEditedTask() {
    // 1️⃣ Mettre à jour le tableau
    this.taches = this.taches.map(t =>
      t.id === this.selectedTask.id ? { ...this.selectedTask } : t
    );

    // 2️⃣ Sauvegarder dans le localStorage
    localStorage.setItem('tasks', JSON.stringify(this.taches));

    // 3️⃣ Fermer le popup
    this.closeEditPopup();
  }

  // popup réunion
  showEditReunionPopup: boolean = false;
  selectedReunion: Reunion = {} as Reunion;

  openEditReunionPopup(reunion: Reunion) {
    this.selectedReunion = { ...reunion };
    this.showEditReunionPopup = true;
  }

  closeEditReunionPopup() {
    this.showEditReunionPopup = false;
  }

   saveEditedReunion() {
    // 1️⃣ Mettre à jour le tableau
    this.reunions = this.reunions.map(r =>
      r.id === this.selectedReunion.id ? { ...this.selectedReunion } : r
    );

    // 2️⃣ Sauvegarder dans le localStorage
    localStorage.setItem('reunions', JSON.stringify(this.reunions));

    // 3️⃣ Mettre à jour la liste filtrée si un filtre est actif
    this.reunionsFiltrees = [...this.reunions];

    // 4️⃣ Fermer le popup
    this.closeEditReunionPopup();
  }
}

