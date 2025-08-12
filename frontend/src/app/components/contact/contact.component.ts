import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-contact',
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
  payload:any = { name:'', email:'', phone:'', message:'' };
  sent = false; sending = false; error='';

  constructor(private api:ApiService){}

  submit(){
    this.sending = true; this.error='';
    this.api.sendContact(this.payload).subscribe({
      next: () => { this.sent = true; this.sending=false; },
      error: (e) => { this.error = e?.error?.message || 'Failed'; this.sending=false; }
    });
  }
}
