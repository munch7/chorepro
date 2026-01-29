import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from '../shared/provider.service';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <section class="hero-header">
      <div class="main-wrapper header-content text-center">
        <h1 class="outfit-font">Account Settings</h1>
        <p class="lead-text">
          Keep your profile up to date to get the best matches.
        </p>
      </div>
    </section>

    <div class="settings-wrapper main-wrapper">
      <div class="settings-grid">
        <aside class="sidebar glass">
          <nav class="side-nav">
            <a routerLink="/dashboard" class="nav-item"
              ><i class="fa fa-th-large"></i> Dashboard</a
            >
            <a routerLink="/settings" routerLinkActive="active" class="nav-item"
              ><i class="fa fa-cog"></i> Settings</a
            >
            <button (click)="logout()" class="logout-btn">
              <i class="fa fa-sign-out"></i> Logout
            </button>
          </nav>
        </aside>

        <main class="settings-content glass">
          <h2 class="outfit-font">Profile Information</h2>
          <form *ngIf="provider" class="settings-form" (ngSubmit)="onSave()">
            <div class="form-group">
              <label>Email Address</label>
              <input
                type="email"
                [(ngModel)]="provider.email"
                name="email"
                disabled
              />
              <small class="help-text">Email cannot be changed online.</small>
            </div>

            <div class="form-group">
              <label>Contact Number (Used for Login)</label>
              <input
                type="text"
                [(ngModel)]="provider.contact"
                name="contact"
                disabled
              />
            </div>
            <div class="form-group">
              <label>Availability Status</label>
              <div class="status-display">
                <span
                  class="status-pill"
                  [class]="provider.availability?.toLowerCase()"
                  >{{ provider.availability }}</span
                >
                <small class="help-text"
                  >Status updates automatically based on your active
                  tasks.</small
                >
              </div>
            </div>

            <div class="form-group">
              <label>Primary Skillset</label>
              <input
                type="text"
                [(ngModel)]="provider.skill"
                name="skill"
                disabled
              />
            </div>

            <div class="form-group">
              <label>Professional Description</label>
              <textarea
                [(ngModel)]="provider.description"
                name="description"
                rows="4"
                placeholder="Tell clients about your expertise..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Update Password</label>
              <div class="password-wrapper">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  [(ngModel)]="provider.password"
                  name="password"
                  placeholder="Required for login"
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

            <div class="form-actions">
              <button type="submit" class="btn btn-primary">
                Save Changes
              </button>
              <span *ngIf="saveSuccess" class="success-msg"
                ><i class="fa fa-check"></i> Profile updated!</span
              >
            </div>
          </form>

          <div *ngIf="!provider" class="text-center">
            <p>Please login to access settings.</p>
            <button class="btn btn-primary" routerLink="/dashboard">
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background:
          linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url('../../assets/20.PNG');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        color: white;
      }

      .hero-header {
        padding: 8rem 0 3rem;
      }
      .settings-wrapper {
        padding: 4rem 0;
      }

      .settings-grid {
        display: grid;
        grid-template-columns: 280px 1fr;
        gap: 3rem;
      }

      .sidebar {
        padding: 2rem;
        border-radius: var(--radius-lg);
        height: fit-content;
      }

      .side-nav {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .nav-item {
        padding: 1rem 1.5rem;
        border-radius: var(--radius-sm);
        color: white;
        text-decoration: none;
        transition: var(--transition);
        display: flex;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
      }
      .nav-item:hover,
      .nav-item.active {
        background: rgba(255, 255, 255, 0.1);
        color: var(--primary);
      }

      .logout-btn {
        margin-top: 2rem;
        padding: 1rem;
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        border-radius: var(--radius-sm);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        transition: var(--transition);
      }
      .logout-btn:hover {
        background: rgba(220, 53, 69, 0.1);
        border-color: #dc3545;
        color: #dc3545;
      }

      .settings-content {
        padding: 4rem;
        border-radius: var(--radius-lg);
      }
      .settings-content h2 {
        margin-bottom: 3rem;
      }

      .settings-form {
        display: flex;
        flex-direction: column;
        gap: 2rem;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .form-group label {
        font-weight: 600;
        font-size: 0.95rem;
      }
      .form-group input,
      .form-group textarea {
        padding: 1rem;
        border-radius: var(--radius-sm);
        border: 2px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        font-size: 1rem;
        transition: var(--transition);
      }
      .form-group input:focus,
      .form-group textarea:focus,
      .form-group select:focus {
        outline: none;
        border-color: var(--primary);
        background: rgba(255, 255, 255, 0.1);
      }
      .form-group input:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .form-group select {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(255, 255, 255, 0.1);
        padding: 1rem;
        border-radius: var(--radius-sm);
        color: white;
        cursor: pointer;
      }
      .status-display {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem 0;
      }
      .status-pill {
        width: fit-content;
        padding: 6px 16px;
        border-radius: 50px;
        font-size: 0.85rem;
        font-weight: 700;
        text-transform: uppercase;
      }
      .status-pill.available {
        background: #2ecc71;
        color: white;
      }
      .status-pill.busy {
        background: #e74c3c;
        color: white;
      }
      .status-pill.part-time {
        background: #f1c40f;
        color: #333;
      }
      .help-text {
        font-size: 0.8rem;
        opacity: 0.6;
      }

      .form-actions {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-top: 1rem;
      }
      .success-msg {
        color: #2ecc71;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      @media (max-width: 992px) {
        .settings-grid {
          grid-template-columns: 1fr;
        }
        .sidebar {
          width: 100%;
        }
        .settings-content {
          padding: 2rem;
        }
      }
    `,
  ],
})
export class SettingsComponent implements OnInit {
  provider: any = null;
  saveSuccess: boolean = false;
  showPassword = false;

  constructor(
    private providerService: ProviderService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.providerService.currentProvider$.subscribe((p) => {
      this.provider = p ? { ...p } : null; // Copy to avoid direct binding to subject
    });
  }

  onSave() {
    this.providerService.updateProvider(this.provider).subscribe(() => {
      this.saveSuccess = true;
      setTimeout(() => (this.saveSuccess = false), 3000);
    });
  }

  logout() {
    this.providerService.logout();
    this.router.navigate(['/dashboard']);
  }
}
