import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CartService } from '../../services/cart.service';
import { CarCardComponent } from '../car-card/car-card.component';
import { HeroComponent } from '../hero/hero.component';
import { SpinViewerComponent } from '../spin-viewer/spin-viewer.component';

@Component({
  selector: 'app-car-grid',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CarCardComponent, HeroComponent, SpinViewerComponent],
  templateUrl: './car-grid.component.html',
  styleUrl: './car-grid.component.css'
})
export class CarGridComponent implements OnInit {
  brands:any[] = [];
  cars:any[] = [];
  q = '';
  brandSlug: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  sort = 'new';
  selected:any = null;
  cartOpen = false;
  viewMode: 'photo' | 'spin' = 'photo';

  constructor(private api:ApiService, private route:ActivatedRoute, private router:Router, private cart:CartService){}

  ngOnInit(){
    this.api.getBrands().subscribe(b => this.brands = b);
    this.route.paramMap.subscribe(map => {
      this.brandSlug = map.get('slug');
      this.fetch();
    });
  }

  fetch(){
    const params:any = { sort: this.sort };
    if (this.q) params.q = this.q;
    if (this.brandSlug) params.brand = this.brandSlug;
    if (this.minPrice) params.minPrice = this.minPrice;
    if (this.maxPrice) params.maxPrice = this.maxPrice;
    this.api.getCars(params).subscribe(c => this.cars = c);
  }

  clearFilters(){
    this.q=''; this.minPrice=null; this.maxPrice=null; this.sort='new';
    this.router.navigate(['/']);
  }

  addToCart(car:any){
    this.cart.add(car);
    this.cartOpen = true;
  }

  cartItems(){ return this.cart.list(); }
  removeFromCart(id:string){ this.cart.remove(id); }
  closeModal(){ this.selected = null; this.viewMode = 'photo'; }
}
