// src/app/components/register.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { LocalDbService } from '../app/services/db.services';
import { User } from '../app/models/user';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private db: LocalDbService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl) {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  get name(): AbstractControl { return this.registerForm.get('name') as AbstractControl; }
  get email(): AbstractControl { return this.registerForm.get('email') as AbstractControl; }
  get password(): AbstractControl { return this.registerForm.get('password') as AbstractControl; }
  get confirmPassword(): AbstractControl { return this.registerForm.get('confirmPassword') as AbstractControl; }

  onSubmit() {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { name, email, password } = this.registerForm.value;

    if (this.db.getUserByEmail(email)) {
      alert('Cet email est déjà utilisé !');
      return;
    }

    const newUser: User = {
      uid: Date.now().toString(),
      name,
      email,
      password,
      role: 'employee',
      createdAt: new Date()
    };

    this.db.addUser(newUser);

    alert('Inscription réussie !');
    this.router.navigate(['/login']);
  }
}
