import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent {
  username = '';
  email = '';
  fullName = '';
  avatarUrl = '';

  oldPassword = '';
  newPassword = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {
    this.loadUserData();
  }

  private loadUserData(): void {
    const user = (this.auth as any).getCurrentUser ? (this.auth as any).getCurrentUser() : null;
    // Fallback: read currentUser directly
    const raw = localStorage.getItem('currentUser');
    const current = user || (raw ? JSON.parse(raw) : null);
    if (current) {
      this.username = current.username;
      this.email = current.email || '';
      this.fullName = current.fullName || '';
      this.avatarUrl = current.avatarUrl || '';
    }
  }

  saveProfile(): void {
    const ok = this.auth.updateProfile({ 
      email: this.email, 
      fullName: this.fullName, 
      avatarUrl: this.avatarUrl 
    });
    if (ok) {
      this.loadUserData(); // Reload user data to reflect changes
      this.success = 'Profil güncellendi.';
      this.error = '';
    } else {
      this.success = '';
      this.error = 'Profil güncellenemedi.';
    }
  }

  changePassword(): void {
    const ok = this.auth.changePassword(this.oldPassword, this.newPassword);
    if (ok) {
      this.loadUserData(); // Reload user data to ensure avatarUrl is preserved
      this.success = 'Şifre güncellendi.';
      this.error = '';
      this.oldPassword = '';
      this.newPassword = '';
    } else {
      this.success = '';
      this.error = 'Şifre değiştirme başarısız.';
    }
  }

  openPreferences(): void {
    this.router.navigate(['/profile/preferences']);
  }
}
