import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app';  // <-- Corrigé : importer AppModule

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
