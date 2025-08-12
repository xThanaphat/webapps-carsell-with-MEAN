import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  brands:any[] = [];
  mobileOpen = false;
  brandOpen = false;
  aboutOpen = false;

  constructor(private api: ApiService){}
  ngOnInit(){
    this.api.getBrands().subscribe(b => this.brands = b);
  }
}
