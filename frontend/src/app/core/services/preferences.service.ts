import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserPreferences, DashboardWidgetConfig } from '../models/user-preferences.model';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private key(userId: string) { return `userPreferences:${userId}`; }

  private defaultPrefs: UserPreferences = {
    theme: 'light',
    language: 'tr',
    timezone: 'UTC+03:00',
    dashboardLayout: [
      { id: 'cpu', title: 'CPU Kullanımı', visible: true, order: 1 },
      { id: 'memory', title: 'Bellek Kullanımı', visible: true, order: 2 },
      { id: 'http', title: 'HTTP Yanıt Süresi', visible: true, order: 3 }
    ]
  };

  private prefsSubject = new BehaviorSubject<UserPreferences>(this.defaultPrefs);
  preferences$ = this.prefsSubject.asObservable();

  load(userId: string): UserPreferences {
    const raw = localStorage.getItem(this.key(userId));
    const prefs = raw ? JSON.parse(raw) as UserPreferences : this.defaultPrefs;
    this.prefsSubject.next(prefs);
    return prefs;
  }

  save(userId: string, prefs: UserPreferences): void {
    localStorage.setItem(this.key(userId), JSON.stringify(prefs));
    this.prefsSubject.next(prefs);
  }

  update(userId: string, partial: Partial<UserPreferences>): void {
    const current = this.prefsSubject.value;
    this.save(userId, { ...current, ...partial });
  }

  setDashboardLayout(userId: string, layout: DashboardWidgetConfig[]): void {
    this.update(userId, { dashboardLayout: layout });
  }
}
