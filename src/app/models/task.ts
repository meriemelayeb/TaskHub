export interface Task {
  id: number;
  title: string;
  description: string;
  assignedTo: string; // nom de l'utilisateur
  status: 'En cours' | 'Terminée'  | 'À faire';
  createdAt: string;
}
