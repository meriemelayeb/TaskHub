import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,         // Standalone
  imports: [RouterOutlet],   // Nécessaire pour <router-outlet> 
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {}
