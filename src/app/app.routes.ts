import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { ServicesComponent } from './services/services.component';
import { SignupComponent } from './signup/signup.component';
import { BookComponent } from './book/book.component';
import { ContactsComponent } from './contacts/contacts.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contacts', component: ContactsComponent },
    { path: 'services', component: ServicesComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'book', component: BookComponent },
];
