import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProviderService } from '../shared/provider.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  provider: any = null;
  requests: any[] = [];
  errorMessage: string | null = null;
  private bookingSub: Subscription | null = null;
  private providerSub: Subscription | null = null;

  constructor(private providerService: ProviderService) {}

  ngOnInit() {
    this.providerSub = this.providerService.currentProvider$.subscribe((p) => {
      this.provider = p;
      if (p) {
        this.loadRequests();
      }
    });
  }

  ngOnDestroy() {
    this.bookingSub?.unsubscribe();
    this.providerSub?.unsubscribe();
  }

  loadRequests() {
    this.bookingSub?.unsubscribe();
    this.bookingSub = this.providerService.getMatchingRequests().subscribe({
      next: (data: any[]) => {
        this.requests = data;
      },
      error: () => {
        this.errorMessage = 'Failed to sync requests. Please refresh.';
      },
    });
  }

  updateStatus(req: any, status: string) {
    if (!req.id || !this.provider?.skill) return;
    const skillName = this.provider.skill;

    this.providerService
      .updateBookingStatus(req.id, status, skillName)
      .subscribe({
        next: () => {
          this.errorMessage = null;
        },
        error: (err: any) => {
          this.errorMessage =
            typeof err === 'string' ? err : 'Status update failed.';
        },
      });
  }

  logout() {
    this.providerService.logout();
    this.requests = [];
  }
}
