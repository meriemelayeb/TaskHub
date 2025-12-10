// app.config.ts (Exemple pour validation)

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes'; // Importe le tableau de routes

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes) // <<-- Ceci assure que vos routes sont activées
  ]
};