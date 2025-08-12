import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartService {
  private KEY = 'premium_cars_cart';
  private get store(){ return JSON.parse(localStorage.getItem(this.KEY)||'[]'); }
  private set store(v:any[]){ localStorage.setItem(this.KEY, JSON.stringify(v)); }

  add(car:any){
    const items = this.store;
    if(!items.find(i => i._id === car._id)){
      items.push({...car, qty:1});
      this.store = items;
    }
  }
  remove(id:string){
    this.store = this.store.filter(i => i._id !== id);
  }
  list(){ return this.store; }
  clear(){ this.store = []; }
}
