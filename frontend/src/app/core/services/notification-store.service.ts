import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationItem } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationStoreService {
  private key = 'notifications';
  private subject = new BehaviorSubject<NotificationItem[]>(this.load());
  notifications$ = this.subject.asObservable();

  private load(): NotificationItem[] {
    const raw = localStorage.getItem(this.key);
    return raw ? JSON.parse(raw) : [];
  }

  private save(items: NotificationItem[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
    this.subject.next(items);
  }

  add(item: NotificationItem): void {
    const items = [...this.subject.value, item];
    this.save(items);
  }

  markRead(id: string): void {
    const items = this.subject.value.map(i => i.id === id ? { ...i, read: true } : i);
    this.save(items);
  }

  markAllRead(): void {
    const items = this.subject.value.map(i => ({ ...i, read: true }));
    this.save(items);
  }

  clear(): void { this.save([]); }

  unreadCount(): number { return this.subject.value.filter(i => !i.read).length; }
}
