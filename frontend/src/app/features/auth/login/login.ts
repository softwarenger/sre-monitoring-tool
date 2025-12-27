import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.scss',
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
export class LoginComponent {
  @ViewChild('loginForm') loginForm?: NgForm;
  
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private auth: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  login() {
    if (!this.username || !this.password) {
      this.error = 'Lütfen tüm alanları doldurunuz.';
      this.cdr.detectChanges();
      return;
    }
    this.isLoading = true;
    this.error = '';
    this.cdr.detectChanges();
    
    setTimeout(() => {
      if (this.auth.login(this.username, this.password)) {
        this.username = '';
        this.password = '';
        this.error = '';
        if (this.loginForm) {
          this.loginForm.reset();
        }
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Kullanıcı adı veya şifre hatalı.';
        this.password = '';
        this.isLoading = false;
        this.cdr.detectChanges();
        
        // 5 saniye sonra hata mesajını otomatik temizle
        setTimeout(() => {
          this.error = '';
          this.cdr.detectChanges();
        }, 5000);
      }
    }, 500);
  }

  clearError() {
    this.error = '';
    this.cdr.detectChanges();
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}

