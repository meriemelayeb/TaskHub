import { Component, OnInit } from '@angular/core';
import { LocalDbService } from '../app/services/db.services';
import Chart from 'chart.js/auto';
import { Task } from '../app/models/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // ===== KPIs =====
  totalTasks = 0;
  tasksTodo = 0;
  tasksInProgress = 0;
  tasksDone = 0;

  meetingsThisWeek = 0;
  averageWorkload = 0;
  totalCompletedTasks = 0;

  topEmployees: any[] = [];

  constructor(private db: LocalDbService) {}

  chart: any; // ajout dans la classe

  ngOnInit(): void {
    this.loadStats();
  }

  ngAfterViewInit(): void {
  this.generatePieChart();
  }

  // ============================
  //      LOAD DATA
  // ============================
  loadStats() {
    const tasks = this.db.getTasks();
    const reunions = this.db.getReunions();

    // Tâches
    this.totalTasks = tasks.length;
    this.tasksTodo = tasks.filter(t => t.status === 'À faire').length;
    this.tasksInProgress = tasks.filter(t => t.status === 'En cours').length;
    this.tasksDone = tasks.filter(t => t.status === 'Terminée').length;

    this.totalCompletedTasks = this.tasksDone;

    // Réunions de cette semaine
    const now = new Date();
    const start = new Date(now.setDate(now.getDate() - now.getDay()));
    const end = new Date(now.setDate(start.getDate() + 7));

    this.meetingsThisWeek = reunions.filter(r => {
      const d = new Date(r.date);
      return d >= start && d <= end;
    }).length;

    // Charge moyenne (nb de tâches / nb personnes distinctes)
    const users = new Set(tasks.map(t => t.assignedTo)); 
    const totalUsers = users.size || 1;
    this.averageWorkload = Math.round(this.totalTasks / totalUsers);

    // Top employés
    this.topEmployees = this.getTopEmployees(tasks);
  }

  // Classement employés
  getTopEmployees(tasks: Task[]): { name: string, completed: number }[] {
  const map: { [key: string]: number } = {};

  tasks.forEach(t => {
    if (t.assignedTo && t.status?.trim().toLowerCase() === 'terminée') {
      map[t.assignedTo] = (map[t.assignedTo] || 0) + 1;
    }
  });

  // Convertit le map en tableau et trie par nombre de tâches terminées
  return Object.entries(map)
    .map(([name, completed]) => ({ name, completed }))
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 2); // Top 5
}

  // ============================
  //          PIE CHART
  // ============================
  generatePieChart() {
  setTimeout(() => {
    const canvas: any = document.getElementById('statusPieChart');
    if (!canvas) return;

    // Détruit le chart existant s'il existe
    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: ['À faire', 'En cours', 'Terminées'],
        datasets: [{
          data: [
            this.tasksTodo,
            this.tasksInProgress,
            this.tasksDone
          ],
          backgroundColor: ['#ff6384','#36a2eb','#4bc0c0']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'bottom' }
        }
      }
    });
  }, 300);
}

  goBack() {
    window.history.back();
  }
}
