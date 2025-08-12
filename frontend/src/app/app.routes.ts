import { Routes } from '@angular/router';
import { CarGridComponent } from './components/car-grid/car-grid.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: CarGridComponent },
  { path: 'brand/:slug', component: CarGridComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', redirectTo: '' }
];
