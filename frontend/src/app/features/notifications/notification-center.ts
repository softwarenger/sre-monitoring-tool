import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NotificationStoreService } from '../../core/services/notification-store.service';
import { NotificationItem } from '../../core/models/notification.model';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.scss'
})
export class NotificationCenterComponent {
  query = '';
  items: NotificationItem[] = [];

  constructor(private store: NotificationStoreService) {
    this.store.notifications$.subscribe(list => {
      this.items = list.sort((a,b) => b.timestamp - a.timestamp);
    });
  }

  markAllRead(): void { this.store.markAllRead(); }
  clear(): void { this.store.clear(); }
  markRead(id: string): void { this.store.markRead(id); }

  filtered(): NotificationItem[] {
    const q = this.query.trim().toLowerCase();
    if (!q) return this.items;
    return this.items.filter(i =>
      i.title.toLowerCase().includes(q) ||
      i.message.toLowerCase().includes(q) ||
      (i.source || '').toLowerCase().includes(q)
    );
  }
}
