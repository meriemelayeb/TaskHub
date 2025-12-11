// src/app/components/employee/employee.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Task } from '../app/models/task';
import { Reunion } from '../app/models/reun';
import { LocalDbService } from '../app/services/db.services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employe.html',
  styleUrls: ['./employe.css']
})
export class EmployeeComponent implements OnInit {
  username = '';
  userRole = '';
  tasks: Task[] = [];
  reunions: Reunion[] = [];
  reunionsFiltrees: Reunion[] = [];

  statusOptions = ['En cours', 'Terminée', 'En attente', 'À faire'];
  etatOptions = ['Prévue', 'Annulée', 'Terminée'];

  constructor(private db: LocalDbService, private router: Router) {}

  ngOnInit(): void {
    const raw = localStorage.getItem('currentUser');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        this.username = user.name || '';   
        this.userRole = user.role || '';
      } catch (e) {
        console.error('Erreur parse currentUser', e);
      }
    } else {
      return;
    }

    this.loadData();
  }

  private loadData() {
    // Récupérer uniquement les tâches assignées à ce user (par nom)
    this.tasks = this.db.getTasksByEmployee(this.username);

    // Afficher toutes les réunions
    this.reunions = this.db.getReunions();
     this.reunionsFiltrees = [...this.reunions]; // copie initiale

  }

  changeTaskStatus(task: Task, newStatus: Task['status']) {
    this.db.updateTaskStatus(task.id, newStatus);
    this.loadData();
  }

  changeReunionEtat(reu: Reunion, newEtat: Reunion['etat']) {
    this.db.updateReunionEtat(reu.id, newEtat);
    this.loadData();
  } 

    supprimerTache(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cette tâche ?')) {
      this.db.deleteTask(id);
      this.loadData();
    }
  }

    logout() {
    localStorage.removeItem('currentUser'); // clé correcte
    this.router.navigate([''], { replaceUrl: true });
    }

  get initials(): string {
    const parts = (this.username || '').trim().split(' ');
    const first = parts[0]?.charAt(0) || '';
    const second = parts[1]?.charAt(0) || '';
    return (first + second).toUpperCase();
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
filtrerPar(event: any) {
  const filtre = event.target.value;
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const debutSemaine = new Date(now);
  debutSemaine.setDate(now.getDate() - now.getDay()); // dimanche
  debutSemaine.setHours(0, 0, 0, 0);

  const finSemaine = new Date(debutSemaine);
  finSemaine.setDate(debutSemaine.getDate() + 6);
  finSemaine.setHours(23, 59, 59, 999);

  const filtered = this.reunions.filter(r => {
    const reunionDate = new Date(r.date);
    reunionDate.setHours(0, 0, 0, 0);

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
        return true;
    }
  });

  this.reunionsFiltrees = filtered.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
}

}