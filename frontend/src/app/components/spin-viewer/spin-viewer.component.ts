import { Component, Input, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-spin-viewer',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="spin-wrap glass" 
       (pointerdown)="onPointerDown($event)" 
       (pointermove)="onPointerMove($event)" 
       (pointerup)="onPointerUp()" 
       (pointerleave)="onPointerUp()"
       (wheel)="onWheel($event)"
       style="position:relative; aspect-ratio: 16/9; width:100%; display:grid; place-items:center; overflow:hidden;">
    <img *ngIf="ready" [src]="frames[current]" [alt]="alt || '360 view'" style="max-width:100%; max-height:100%; object-fit:contain; user-select:none; pointer-events:none;">
    <div *ngIf="!ready" style="position:absolute; inset:0; display:grid; place-items:center; color:var(--muted)">
      <div>Loading {{loaded}}/{{total}}…</div>
    </div>
    <div class="hint" style="position:absolute; bottom:10px; left:50%; transform:translateX(-50%); font-size:12px; background:rgba(255,255,255,.6); border:1px solid #e5e7eb; padding:4px 8px; border-radius:999px;">Drag left/right • Scroll to rotate</div>
  </div>
  `,
  styles: [`.spin-wrap{ background:#fff; border-radius:16px; }`]
})
export class SpinViewerComponent {
  @Input() frames: string[] = [];
  @Input() alt = '';
  @Input() dragSensitivity = 6; // ยิ่งมาก หมุนช้าลง

  ready = false;
  current = 0;
  startX = 0;
  isDown = false;
  loaded = 0;
  total = 0;

  ngOnInit(){
    this.total = this.frames?.length || 0;
    if (!this.total) return;
    // preload
    const promises = this.frames.map(src => new Promise<void>(res => {
      const img = new Image();
      img.onload = () => { this.loaded++; res(); };
      img.onerror = () => { this.loaded++; res(); };
      img.src = src;
    }));
    Promise.all(promises).then(() => this.ready = true);
  }

  clamp(i:number){
    if(!this.total) return 0;
    return (i % this.total + this.total) % this.total; // วนลูป
  }

  onPointerDown(e:PointerEvent){
    this.isDown = true; this.startX = e.clientX; (e.target as Element).setPointerCapture(e.pointerId);
  }
  onPointerMove(e:PointerEvent){
    if(!this.isDown || !this.total) return;
    const dx = e.clientX - this.startX;
    const step = Math.trunc(dx / this.dragSensitivity);
    if (step !== 0){
      this.current = this.clamp(this.current - step);
      this.startX = e.clientX;
    }
  }
  onPointerUp(){ this.isDown = false; }

  onWheel(e:WheelEvent){
    if(!this.total) return;
    e.preventDefault();
    const dir = Math.sign(e.deltaY); // เลื่อนลง = บวก
    this.current = this.clamp(this.current + dir);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(e:KeyboardEvent){
    if(!this.total) return;
    if(e.key === 'ArrowLeft') this.current = this.clamp(this.current - 1);
    if(e.key === 'ArrowRight') this.current = this.clamp(this.current + 1);
  }
}
