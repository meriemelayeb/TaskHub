import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- pour [routerLink]

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  activeBtn: string = '';

  setActive(btn: string): void {
    this.activeBtn = btn;
  }
}
