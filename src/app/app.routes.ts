import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    // { path: '**', redirectTo: '' },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'signup', component: SignupComponent },
];
