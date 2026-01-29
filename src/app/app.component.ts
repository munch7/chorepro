import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';
import { ProviderService } from './shared/provider.service';
import { ClientService } from './shared/client.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'chorepro';
  isMenuOpen = false;
  lastScrollTop = 0;
  isNavHidden = false;
  isAtTop = true;
  provider: any = null;
  lastBookingId: string | null = null;
  allBookings: any[] = [];

  private providerService: ProviderService = inject(ProviderService);
  private clientService: ClientService = inject(ClientService);
  private router: Router = inject(Router);

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', this.onScroll.bind(this));
    }

    // Real-time provider state
    this.providerService.currentProvider$.subscribe((p) => (this.provider = p));

    // Get last booking for quick access in header
    this.lastBookingId = this.clientService.getLastBookingId();
    this.allBookings = this.clientService.getAllBookings();

    // Fix: Open all pages from the top
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (typeof window !== 'undefined') {
          window.scrollTo(0, 0);
          this.closeMenu();
          // Refresh bookings on each navigation to catch updates
          this.lastBookingId = this.clientService.getLastBookingId();
        }
      });
  }

  onScroll() {
    const st = window.pageYOffset || document.documentElement.scrollTop;

    // Check if at top
    this.isAtTop = st < 50;

    if (st > this.lastScrollTop && st > 100) {
      // Downscroll code
      this.isNavHidden = true;
    } else {
      // Upscroll code
      this.isNavHidden = false;
    }
    this.lastScrollTop = st <= 0 ? 0 : st;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }
}
