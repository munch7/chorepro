import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  services = [
    { name: 'Electronics', description: 'Indoor & outdoor repairs, Portable devices repairs' },
    { name: 'Plumbing', description: 'Any and all plumbing services' },
    { name: 'Deliveries / Errands', description: 'Supermarket or Soko deliveries, Personal errands' },
    { name: 'Decorating', description: 'Paint work, Event set-up' },
    { name: 'House / Pet Sitting', description: 'House sitting, Pet sitting' },
    { name: 'Assembly / Mounting', description: 'Installation of indoor or outdoor home appliances' },
    { name: 'Moving', description: 'Logistics of home appliances within or outside the premises' },
    { name: 'Cleaning', description: 'Laundry services, Household cleaning, Compound cleaning' },
    { name: 'Outdoor Help', description: 'Landscaping, Gardening, Farming' },
    { name: 'Home Repairs', description: 'Roofing, Masonry repairs, Carpentry' }
  ];

  constructor(private router: Router) {}

  navigateToService(service: string) {
    this.router.navigate(['/services', service]);
  }
}
