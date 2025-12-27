import { Component, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationStoreService } from './core/services/notification-store.service';
import { NotificationTriggersService } from './core/services/notification-triggers.service';
import { Observable } from 'rxjs';
import { User } from './core/models/user.model';
import { TranslatePipe } from './core/pipes/translate.pipe';
import { LanguageService } from './core/services/language.service';
import { PreferencesService } from './core/services/preferences.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatBadgeModule,
    MatMenuModule,
    MatTooltipModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  @ViewChild('sidenav') sidenav?: MatSidenav;
  title = 'SRE Operasyonel İzleme';
  isAuthenticated$: Observable<User | null>;
  unreadCount = 0;

  constructor(
    private auth: AuthService, 
    private router: Router, 
    private store: NotificationStoreService, 
    private triggers: NotificationTriggersService,
    private languageService: LanguageService,
    private prefsService: PreferencesService
  ) {
    this.isAuthenticated$ = this.auth.currentUser$;
    this.store.notifications$.subscribe(list => {
      this.unreadCount = list.filter(i => !i.read).length;
    });
    this.triggers.init();
    
    // Kullanıcı giriş yaptığında dil tercihini yükle
    this.auth.currentUser$.subscribe(user => {
      if (user) {
        const prefs = this.prefsService.load(user.id);
        this.languageService.setLanguage(prefs.language);
        
        // Title'ı güncelle
        this.updateTitle();
      }
    });
    
    // Dil değiştiğinde title'ı güncelle
    this.languageService.currentLang$.subscribe(() => {
      this.updateTitle();
    });
  }
  
  private updateTitle(): void {
    this.title = this.languageService.translate('app.title');
  }

  toggleSidenav(): void {
    this.sidenav?.toggle();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
