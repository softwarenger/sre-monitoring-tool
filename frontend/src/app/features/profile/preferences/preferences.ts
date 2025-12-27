import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PreferencesService } from '../../../core/services/preferences.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserPreferences } from '../../../core/models/user-preferences.model';
import { LanguageService } from '../../../core/services/language.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    TranslatePipe
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss'
})
export class PreferencesComponent {
  prefs: UserPreferences | null = null;
  userId = '';
  success = '';
  error = '';

  // Zaman dilimi seçenekleri
  timezones = [
    { value: 'UTC-12:00', label: 'UTC-12:00 (Baker Island)' },
    { value: 'UTC-11:00', label: 'UTC-11:00 (American Samoa)' },
    { value: 'UTC-10:00', label: 'UTC-10:00 (Hawaii)' },
    { value: 'UTC-09:00', label: 'UTC-09:00 (Alaska)' },
    { value: 'UTC-08:00', label: 'UTC-08:00 (Pacific Time)' },
    { value: 'UTC-07:00', label: 'UTC-07:00 (Mountain Time)' },
    { value: 'UTC-06:00', label: 'UTC-06:00 (Central Time)' },
    { value: 'UTC-05:00', label: 'UTC-05:00 (Eastern Time)' },
    { value: 'UTC-04:00', label: 'UTC-04:00 (Atlantic Time)' },
    { value: 'UTC-03:00', label: 'UTC-03:00 (Buenos Aires)' },
    { value: 'UTC-02:00', label: 'UTC-02:00 (Mid-Atlantic)' },
    { value: 'UTC-01:00', label: 'UTC-01:00 (Azores)' },
    { value: 'UTC+00:00', label: 'UTC+00:00 (London)' },
    { value: 'UTC+01:00', label: 'UTC+01:00 (Paris, Berlin)' },
    { value: 'UTC+02:00', label: 'UTC+02:00 (Cairo, Athens)' },
    { value: 'UTC+03:00', label: 'UTC+03:00 (İstanbul, Moskova)' },
    { value: 'UTC+04:00', label: 'UTC+04:00 (Dubai)' },
    { value: 'UTC+05:00', label: 'UTC+05:00 (Islamabad)' },
    { value: 'UTC+05:30', label: 'UTC+05:30 (Mumbai, Delhi)' },
    { value: 'UTC+06:00', label: 'UTC+06:00 (Dhaka)' },
    { value: 'UTC+07:00', label: 'UTC+07:00 (Bangkok)' },
    { value: 'UTC+08:00', label: 'UTC+08:00 (Beijing, Singapore)' },
    { value: 'UTC+09:00', label: 'UTC+09:00 (Tokyo, Seoul)' },
    { value: 'UTC+10:00', label: 'UTC+10:00 (Sydney)' },
    { value: 'UTC+11:00', label: 'UTC+11:00 (Solomon Islands)' },
    { value: 'UTC+12:00', label: 'UTC+12:00 (Auckland)' }
  ];

  // Dil seçenekleri
  languages = [
    { value: 'tr', label: 'Türkçe' },
    { value: 'en', label: 'English' }
  ];

  constructor(
    private prefsService: PreferencesService, 
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private languageService: LanguageService
  ) {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;
    this.userId = user?.id || 'default';
    this.prefs = this.prefsService.load(this.userId);
    
    // Mevcut dili ayarla
    if (this.prefs) {
      this.languageService.setLanguage(this.prefs.language);
    }
  }

  save(): void {
    if (!this.prefs) {
      this.error = 'Tercihler yüklenemedi';
      return;
    }
    
    try {
      // Dil değişikliğini uygula
      this.languageService.setLanguage(this.prefs.language);
      
      this.prefsService.save(this.userId, this.prefs);
      this.success = 'Tercihler kaydedildi';
      this.error = '';
      
      // Snackbar ile bildirim göster
      const message = this.languageService.translate('preferences.saved');
      this.snackBar.open(`✓ ${message}`, this.languageService.translate('close'), {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['success-snackbar']
      });
    } catch (e) {
      this.error = 'Tercihler kaydedilemedi';
      this.success = '';
      const message = this.languageService.translate('preferences.saveFailed');
      this.snackBar.open(`✗ ${message}`, this.languageService.translate('close'), {
        duration: 3000,
        horizontalPosition: 'end',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
    }
  }
}
