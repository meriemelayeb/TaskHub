import { Component, OnInit } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { LocalDbService } from '../app/services/db.services';
import Chart from 'chart.js/auto';
import { Task } from '../app/models/task';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, CommonModule],
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

  tasksCompletedThisWeek = 0;
  employeeActivity: any[] = [];
  meetingTaskRatio = 0;
  meetingTaskRatioStatus = ""; // Pour afficher bon / limite / mauvais


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

  //   PRODUCTIVITÉ PAR SEMAINE
  this.tasksCompletedThisWeek = tasks.filter(t => {
  if (t.status?.trim().toLowerCase() !== "terminée") return false;
  const d = new Date(t.createdAt);
  return d >= start && d <= end;
  }).length;

  //   ACTIVITÉ DES EMPLOYÉS
    this.employeeActivity = this.getEmployeeActivity(tasks);


  //   RATIO RÉUNIONS / TÂCHES TERMINÉES

    this.meetingTaskRatio = this.calculateMeetingTaskRatio();

    if (this.meetingTaskRatio < 0.5) {
      this.meetingTaskRatioStatus = "🟢 Excellent : Productivité élevée";
    } else if (this.meetingTaskRatio < 1) {
      this.meetingTaskRatioStatus = "🟡 Acceptable : Attention au trop de réunions";
    } else {
      this.meetingTaskRatioStatus = "🔴 Trop de réunions par rapport au travail produit";
    }
    console.log('Employee activity:', this.employeeActivity);

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

 getEmployeeActivity(tasks: Task[]) {
  const map: { [key: string]: number } = {};

  tasks.forEach(t => {
    // Prendre en compte assignedTo comme string ou objet
    let name = '';
    if (typeof t.assignedTo === 'string') {
      name = t.assignedTo.trim();
    } else if (t.assignedTo && typeof t.assignedTo === 'object' && 'name' in t.assignedTo) {
      name = (t.assignedTo as any).name.trim();
    }

    if (name !== '') {
      map[name] = (map[name] || 0) + 1;
    }
  });

  return Object.entries(map)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}

 calculateMeetingTaskRatio(): number {
  if (this.totalCompletedTasks === 0) return Infinity;
  return this.meetingsThisWeek / this.totalCompletedTasks;
  }
  goBack() {
    window.history.back();
  }
}
