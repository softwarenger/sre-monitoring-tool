import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';
  error = '';
  success = '';
  isLoading = false;

  constructor(private auth: AuthService, private router: Router) {}

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  register() {
    if (!this.username || !this.password) {
      this.error = 'Kullanıcı adı ve şifre zorunludur.';
      return;
    }

    if (this.username.length < 3) {
      this.error = 'Kullanıcı adı en az 3 karakter olmalıdır.';
      return;
    }

    if (this.password.length < 4) {
      this.error = 'Şifre en az 4 karakter olmalıdır.';
      return;
    }

    this.isLoading = true;
    this.error = '';
    this.success = '';

    setTimeout(() => {
      try {
        const user = {
          id: this.generateId(),
          username: this.username,
          password: this.password,
          email: this.email
        };
        
        const result = this.auth.register(user);
        console.log('Kayıt sonucu:', result);
        
        if (result) {
          this.success = 'Kayıt başarılı! Giriş yapabilirsiniz.';
          this.error = '';
          this.isLoading = false;
          
          // Form verilerini temizle
          this.username = '';
          this.password = '';
          this.email = '';
          
          // Giriş sayfasına yönlendir
          setTimeout(() => this.router.navigate(['/login']), 1500);
        } else {
          this.error = 'Bu kullanıcı adı zaten alınmış.';
          this.success = '';
          this.isLoading = false;
        }
      } catch (err) {
        console.error('Kayıt hatası:', err);
        this.error = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        this.isLoading = false;
      }
    }, 500);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
