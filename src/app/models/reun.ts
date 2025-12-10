export interface Reunion {
  id: number;
  nom: string;
  description: string;
  etat: 'Prévue' | 'Annulée' | 'Terminée'; // état de la réunion
  date: string;

}
