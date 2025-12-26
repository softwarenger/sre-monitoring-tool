import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PreferencesService } from '../../../core/services/preferences.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserPreferences } from '../../../core/models/user-preferences.model';

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
    MatButtonModule
  ],
  templateUrl: './preferences.html',
  styleUrl: './preferences.scss'
})
export class PreferencesComponent {
  prefs: UserPreferences | null = null;
  userId = '';

  constructor(private prefsService: PreferencesService, private auth: AuthService) {
    const raw = localStorage.getItem('currentUser');
    const user = raw ? JSON.parse(raw) : null;
    this.userId = user?.id || 'default';
    this.prefs = this.prefsService.load(this.userId);
  }

  save(): void {
    if (!this.prefs) return;
    this.prefsService.save(this.userId, this.prefs);
  }
}
