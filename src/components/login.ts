// src/app/components/login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { LocalDbService } from '../app/services/db.services';
import { User } from '../app/models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private db: LocalDbService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get email(): AbstractControl { return this.loginForm.get('email') as AbstractControl; }
  get password(): AbstractControl { return this.loginForm.get('password') as AbstractControl; }

  onSubmit() {
  if (!this.loginForm.valid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  const { email, password } = this.loginForm.value;
  const user: User | null = this.db.checkCredentials(email, password);

  if (!user) {
    alert('Email ou mot de passe incorrect !');
    return;
  }

  localStorage.setItem('currentUser', JSON.stringify(user));

  // ✅ Sauvegarde pour le header
  localStorage.setItem('username', user.name);
  localStorage.setItem('userRole', user.role);

  // Redirection selon rôle
  if (user.role === 'admin') {
    this.router.navigate(['/admin']);
  } else if (user.role === 'employee') {
  this.router.navigate(['/employee']);
  } else {
    this.router.navigate(['/home']);
  }
}
}
