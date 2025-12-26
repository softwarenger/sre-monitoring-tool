import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private themeSubject = new BehaviorSubject<'light'|'dark'>('light');
  theme$ = this.themeSubject.asObservable();

  constructor(@Inject(DOCUMENT) private doc: Document) {}

  apply(theme: 'light'|'dark'): void {
    const body = this.doc.body;
    body.classList.remove('app-theme-light', 'app-theme-dark');
    body.classList.add(theme === 'light' ? 'app-theme-light' : 'app-theme-dark');
    this.themeSubject.next(theme);
  }
}
