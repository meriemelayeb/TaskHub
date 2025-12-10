// src/app/services/local-db.service.ts
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Task } from '../models/task';
import { Reunion } from '../models/reun';

@Injectable({ providedIn: 'root' })
export class LocalDbService {
   private TASKS_KEY = 'tasks';       // clé pour stocker les tâches dans localStorage
  private REUNIONS_KEY = 'reunions'; // clé pour stocker les réunions dans localStorage


  private USERS_KEY = 'users';

  constructor() {
    // Optionnel : initialiser des tableaux vides si pas encore présents
    if (!localStorage.getItem(this.TASKS_KEY)) localStorage.setItem(this.TASKS_KEY, JSON.stringify([]));
    if (!localStorage.getItem(this.REUNIONS_KEY)) localStorage.setItem(this.REUNIONS_KEY, JSON.stringify([]));
    if (!localStorage.getItem(this.USERS_KEY)) localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
  }

  // 🔹 Récupérer tous les utilisateurs
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // 🔹 Ajouter un utilisateur
  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // 🔹 Trouver un utilisateur par email
  getUserByEmail(email: string): User | undefined {
    return this.getUsers().find(u => u.email === email);
  }

  // 🔹 Vérifier email/mot de passe (login)
  checkCredentials(email: string, password: string): User | null {
    const user = this.getUserByEmail(email);
    if (user && user.password === password) return user;
    return null;
  }

   // ================= Task ===============
   getTasks(): Task[] {
    return JSON.parse(localStorage.getItem(this.TASKS_KEY) || '[]') as Task[];
  }
  
  addTask(task: Task) {
    const tasks = this.getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  deleteTask(id: number) {
    const tasks = this.getTasks().filter(t => t.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
saveTasks(tasks: Task[]): void {
    localStorage.setItem(this.TASKS_KEY, JSON.stringify(tasks));
  }

  // Retourne les tâches assignées à l'utilisateur identifié par userId (uid)
  getTasksByEmployee(userId: string): Task[] {
    if (!userId) return [];
    return this.getTasks().filter(t => t.assignedTo === userId);
  }

  // Modifier uniquement le statut d’une tâche
  updateTaskStatus(taskId: number, newStatus: Task['status']): Task | null {
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.status = newStatus;
    this.saveTasks(tasks);
    return task;
  }

  // ================= Reunion =================
  getReunions(): Reunion[] {
    return JSON.parse(localStorage.getItem('reunions') || '[]');
  }

  addReunion(reunion: Reunion) {
    const reunions = this.getReunions();
    reunions.push(reunion);
    localStorage.setItem('reunions', JSON.stringify(reunions));
  }

  deleteReunion(id: number) {
    const reunions = this.getReunions().filter(r => r.id !== id);
    localStorage.setItem('reunions', JSON.stringify(reunions));
  }
  saveReunions(reunions: Reunion[]): void {
    localStorage.setItem(this.REUNIONS_KEY, JSON.stringify(reunions));
  }

  updateReunionEtat(reunionId: number, newEtat: Reunion['etat']): Reunion | null {
    const reunions = this.getReunions();
    const reunion = reunions.find(r => r.id === reunionId);
    if (!reunion) return null;

    reunion.etat = newEtat;
    this.saveReunions(reunions);
    return reunion;
  }
  
  // admin - mettre à jour une réunion complète
  updateReunion(updatedReunion: Reunion) {
  const reunions = this.getReunions().map(r =>
    r.id === updatedReunion.id ? updatedReunion : r
  );

  localStorage.setItem('reunions', JSON.stringify(reunions));
}

}

