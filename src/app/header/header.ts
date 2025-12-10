import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  userName: string = '';
  userInitials: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedName = localStorage.getItem('username');

    if (storedName) {
      this.userName = storedName;
      this.generateInitials(this.userName);
    } else {
      this.userInitials = '??';   // en cas de problème
    }
  }

  generateInitials(name: string) {
    const parts = name.trim().split(' ');

    if (parts.length === 1) {
      this.userInitials = parts[0].charAt(0).toUpperCase();
    } else {
      this.userInitials =
        parts[0].charAt(0).toUpperCase() +
        parts[parts.length - 1].charAt(0).toUpperCase();
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
