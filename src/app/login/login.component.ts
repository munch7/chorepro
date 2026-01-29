import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from '../shared/provider.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="login-hero">
      <div class="main-wrapper">
        <div class="login-container glass">
          <div class="login-header text-center">
            <h1 class="outfit-font">Welcome Back</h1>
            <p class="lead-text">
              Access your provider dashboard to manage chores.
            </p>
          </div>

          <!-- Success Message for New Accounts -->
          <div *ngIf="signupSuccess" class="success-banner glass mb-4">
            <i class="fa fa-check-circle"></i>
            <span>Account created! Please click below to login.</span>
          </div>

          <!-- Session Expired Message -->
          <div
            *ngIf="sessionExpired"
            class="error-msg text-warning text-center glass p-3 mb-4"
          >
            <i class="fa fa-clock-o"></i>
            <span>Session expired due to 15 mins of inactivity.</span>
          </div>

          <div class="login-form">
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                [(ngModel)]="loginEmail"
                placeholder="email@example.com"
                class="form-control"
              />
            </div>

            <div class="form-group">
              <label>Password</label>
              <div class="password-wrapper">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="loginPassword"
                  placeholder="Enter your password"
                  class="form-control"
                />
                <button
                  type="button"
                  class="toggle-password"
                  (click)="showPassword = !showPassword"
                >
                  <i
                    class="fa"
                    [ngClass]="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                  ></i>
                </button>
              </div>
            </div>

            <button
              class="btn btn-primary btn-block"
              (click)="onLogin()"
              [disabled]="loading"
            >
              <span *ngIf="!loading">Login to Dashboard</span>
              <span *ngIf="loading">Authenticating...</span>
            </button>
          </div>

          <p *ngIf="loginError" class="error-msg text-danger text-center">
            {{ loginError }}
          </p>

          <div class="login-footer text-center">
            <p>
              Don't have an account? <a routerLink="/signup">Sign up here</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .login-hero {
        min-height: 100vh;
        padding: 10rem 0 5rem;
        background:
          linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
          url('../../assets/20.PNG');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        display: flex;
        align-items: center;
      }

      .login-container {
        max-width: 500px;
        margin: 0 auto;
        padding: 3.5rem;
        border-radius: var(--radius-lg);
      }

      .login-header h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }

      @media (max-width: 768px) {
        .login-hero {
          padding: 6rem 0 3rem;
        }
        .login-container {
          padding: 2.5rem 1.5rem;
          margin: 0 1rem;
        }
        .login-header h1 {
          font-size: 2rem;
        }
      }

      .login-form {
        margin: 2.5rem 0;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-group label {
        font-size: 0.9rem;
        font-weight: 600;
        opacity: 0.9;
      }

      .form-control {
        width: 100%;
        padding: 1rem;
        border-radius: var(--radius-sm);
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.9);
        color: #333;
        font-size: 1rem;
        transition: var(--transition);
      }

      .form-control:focus {
        border-color: var(--primary);
        outline: none;
        box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.2);
      }

      .password-wrapper {
        position: relative;
      }

      .toggle-password {
        position: absolute;
        right: 1rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #666;
        cursor: pointer;
      }

      .btn-block {
        width: 100%;
        padding: 1.2rem;
        font-size: 1.1rem;
      }

      .success-banner {
        padding: 1.2rem;
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        gap: 1rem;
        background: rgba(46, 204, 113, 0.2);
        border: 1px solid #2ecc71;
        color: #2ecc71;
        margin: 1.5rem 0;
      }

      .error-msg {
        margin-top: 1rem;
        font-weight: 600;
      }

      .login-footer {
        margin-top: 2rem;
        padding-top: 2rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }

      .login-footer a {
        color: var(--primary);
        font-weight: 600;
        text-decoration: none;
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  loginEmail = '';
  loginPassword = '';
  showPassword = false;
  loginError: string | null = null;
  signupSuccess = false;
  sessionExpired = false;
  loading = false;

  constructor(
    private providerService: ProviderService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    // Handle session expiration
    this.route.queryParams.subscribe((params) => {
      if (params['sessionExpired'] === 'true') {
        this.sessionExpired = true;
      }
    });

    // Handle auto-login from signup
    this.route.queryParams.subscribe((params) => {
      if (
        params['email'] &&
        params['password'] &&
        params['newAccount'] === 'true'
      ) {
        this.loginEmail = params['email'];
        this.loginPassword = params['password'];
        this.signupSuccess = true;

        console.log(
          'LoginComponent: Credentials pre-filled for:',
          this.loginEmail,
        );

        // Hide success message after 10 seconds
        setTimeout(() => (this.signupSuccess = false), 10000);
      }
    });
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) return;

    this.loading = true;
    this.loginError = null;

    this.providerService
      .login(this.loginEmail, this.loginPassword)
      .subscribe((success) => {
        this.loading = false;
        if (!success) {
          this.loginError = 'Invalid email or password. Please try again.';
        } else {
          this.loginError = null;
          this.router.navigate(['/dashboard']);
        }
      });
  }
}
