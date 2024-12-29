import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-container">
      <div class="glass-card register-form">
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <input
              type="email"
              formControlName="email"
              placeholder="Email"
              class="glass-input"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              formControlName="password"
              placeholder="Password"
              class="glass-input"
            />
          </div>
          <div class="form-group">
            <input
              type="password"
              formControlName="confirmPassword"
              placeholder="Confirm Password"
              class="glass-input"
            />
          </div>
          <button type="submit" class="glass-button" [disabled]="!registerForm.valid">
            Register
          </button>
        </form>
        <p class="auth-link">
          Already have an account? 
          <a routerLink="/login">Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 20px;
    }

    .register-form {
      width: 100%;
      max-width: 400px;
    }

    h2 {
      color: white;
      text-align: center;
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    input {
      width: 100%;
      box-sizing: border-box;
    }

    button {
      width: 100%;
      margin-top: 20px;
    }

    .auth-link {
      text-align: center;
      margin-top: 20px;
      color: white;

      a {
        color: #a5b4fc;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      try {
        const { email, password } = this.registerForm.value;
        await this.auth.register(email, password);
        this.router.navigate(['/books']);
      } catch (error) {
        console.error('Registration failed:', error);
        // Here you could add proper error handling/display
      }
    }
  }
}
