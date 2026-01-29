import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ClientService } from '../shared/client.service';
import { Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-status',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './status.component.html',
  styleUrl: './status.component.css',
})
export class StatusComponent implements OnInit {
  private route: ActivatedRoute = inject(ActivatedRoute);
  private clientService: ClientService = inject(ClientService);
  private router: Router = inject(Router);

  recentBookings: any[] = [];

  booking$: Observable<any> = this.route.params.pipe(
    switchMap((params) => {
      const id = params['id'] || this.clientService.getLastBookingId();
      if (!id) return of(null);
      return this.clientService.getBookingStatus(id);
    }),
  );

  ngOnInit(): void {
    this.loadRecentBookings();
  }

  loadRecentBookings() {
    this.recentBookings = this.clientService.getAllBookings();
  }

  getServiceStatus(services: any, skill: string): string {
    return services?.[skill]?.status || 'pending';
  }

  getOverallStatus(booking: any): string {
    if (!booking?.services) return 'pending';
    const statuses = Object.values(booking.services).map((s: any) => s.status);
    if (statuses.every((s) => s === 'completed')) return 'completed';
    if (statuses.some((s) => s === 'in-progress' || s === 'completed'))
      return 'in-progress';
    return 'pending';
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'completed':
        return 'fa-check-circle';
      case 'in-progress':
        return 'fa-refresh fa-spin';
      default:
        return 'fa-clock-o';
    }
  }

  switchBooking(id: string) {
    this.router.navigate(['/track', id]);
  }
}
