import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, NgFor, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  services = [
    {
      name: 'Electronics',
      description: 'Indoor & outdoor repairs, Portable devices repairs',
    },
    { name: 'Plumbing', description: 'Any and all plumbing services' },
    {
      name: 'Deliveries / Errands',
      description: 'Supermarket or Soko deliveries, Personal errands',
    },
    { name: 'Decorating', description: 'Paint work, Event set-up' },
    { name: 'House / Pet Sitting', description: 'House sitting, Pet sitting' },
    {
      name: 'Assembly / Mounting',
      description: 'Installation of indoor or outdoor home appliances',
    },
    {
      name: 'Moving',
      description:
        'Logistics of home appliances within or outside the premises',
    },
    {
      name: 'Cleaning',
      description: 'Laundry services, Household cleaning, Compound cleaning',
    },
    { name: 'Outdoor Help', description: 'Landscaping, Gardening, Farming' },
    {
      name: 'Home Repairs',
      description: 'Roofing, Masonry repairs, Carpentry',
    },
  ];

  slides: any[] = new Array(3).fill({
    id: -1,
    src: '',
    title: '',
    subtitle: '',
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.slides[0] = {
      src: './assets/img/angular.jpg',
    };
    this.slides[1] = {
      src: './assets/img/react.jpg',
    };
    this.slides[2] = {
      src: './assets/img/vue.jpg',
    };
  }

  navigateToService(service: string) {
    this.router.navigate(['/services', service]);
  }
}
