import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Translations {
  [key: string]: string;
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang = 'tr';
  private currentLangSubject = new BehaviorSubject<string>('tr');
  currentLang$ = this.currentLangSubject.asObservable();

  private translations: { [lang: string]: Translations } = {
    tr: {
      // Genel
      'app.title': 'SRE Operasyonel İzleme',
      'save': 'Kaydet',
      'cancel': 'İptal',
      'close': 'Kapat',
      'delete': 'Sil',
      'edit': 'Düzenle',
      'search': 'Ara',
      'settings': 'Ayarlar',
      
      // Menü
      'menu.dashboard': 'Dashboard',
      'menu.metrics': 'Metrikler',
      'menu.services': 'Servisler',
      'menu.system': 'Sistem',
      'menu.notifications': 'Bildirimler',
      'menu.profile': 'Profil',
      
      // Profil
      'profile.title': 'Profil Bilgileri',
      'profile.subtitle': 'Hesap bilgilerinizi güncelleyin',
      'profile.username': 'Kullanıcı Adı',
      'profile.fullName': 'Ad Soyad',
      'profile.fullNamePlaceholder': 'Adınız ve soyadınız',
      'profile.email': 'E-posta',
      'profile.emailPlaceholder': 'ornek@email.com',
      'profile.avatarUrl': 'Avatar URL',
      'profile.avatarUrlPlaceholder': 'https://...',
      'profile.updated': 'Profil güncellendi.',
      'profile.updateFailed': 'Profil güncellenemedi.',
      
      // Şifre
      'password.title': 'Şifre Değiştir',
      'password.subtitle': 'Hesabınızı güvenli tutun',
      'password.old': 'Eski Şifre',
      'password.new': 'Yeni Şifre',
      'password.update': 'Şifreyi Güncelle',
      'password.updated': 'Şifre güncellendi.',
      'password.updateFailed': 'Şifre değiştirme başarısız.',
      
      // Tercihler
      'preferences.title': 'Tercihler',
      'preferences.subtitle': 'Uygulama tercihlerinizi özelleştirin',
      'preferences.language': 'Dil',
      'preferences.languageHint': 'Uygulamanın görüntüleneceği dil',
      'preferences.timezone': 'Zaman Dilimi',
      'preferences.timezoneHint': 'Tarih ve saat bilgilerinin gösterileceği zaman dilimi',
      'preferences.saved': 'Tercihleriniz başarıyla kaydedildi',
      'preferences.saveFailed': 'Bir hata oluştu',
      
      // Butonlar
      'button.preferences': 'Tercihler',
      'button.logout': 'Çıkış',
      'button.save': 'Kaydet',
      
      // Tooltip
      'tooltip.notifications': 'Bildirimler',
      'tooltip.profile': 'Profil'
    },
    en: {
      // General
      'app.title': 'SRE Operational Monitoring',
      'save': 'Save',
      'cancel': 'Cancel',
      'close': 'Close',
      'delete': 'Delete',
      'edit': 'Edit',
      'search': 'Search',
      'settings': 'Settings',
      
      // Menu
      'menu.dashboard': 'Dashboard',
      'menu.metrics': 'Metrics',
      'menu.services': 'Services',
      'menu.system': 'System',
      'menu.notifications': 'Notifications',
      'menu.profile': 'Profile',
      
      // Profile
      'profile.title': 'Profile Information',
      'profile.subtitle': 'Update your account information',
      'profile.username': 'Username',
      'profile.fullName': 'Full Name',
      'profile.fullNamePlaceholder': 'Your full name',
      'profile.email': 'Email',
      'profile.emailPlaceholder': 'example@email.com',
      'profile.avatarUrl': 'Avatar URL',
      'profile.avatarUrlPlaceholder': 'https://...',
      'profile.updated': 'Profile updated.',
      'profile.updateFailed': 'Failed to update profile.',
      
      // Password
      'password.title': 'Change Password',
      'password.subtitle': 'Keep your account secure',
      'password.old': 'Old Password',
      'password.new': 'New Password',
      'password.update': 'Update Password',
      'password.updated': 'Password updated.',
      'password.updateFailed': 'Failed to change password.',
      
      // Preferences
      'preferences.title': 'Preferences',
      'preferences.subtitle': 'Customize your application preferences',
      'preferences.language': 'Language',
      'preferences.languageHint': 'Display language for the application',
      'preferences.timezone': 'Timezone',
      'preferences.timezoneHint': 'Timezone for displaying dates and times',
      'preferences.saved': 'Your preferences have been saved successfully',
      'preferences.saveFailed': 'An error occurred',
      
      // Buttons
      'button.preferences': 'Preferences',
      'button.logout': 'Logout',
      'button.save': 'Save',
      
      // Tooltip
      'tooltip.notifications': 'Notifications',
      'tooltip.profile': 'Profile'
    }
  };

  setLanguage(lang: 'tr' | 'en'): void {
    this.currentLang = lang;
    this.currentLangSubject.next(lang);
  }

  getLanguage(): string {
    return this.currentLang;
  }

  translate(key: string): string {
    return this.translations[this.currentLang]?.[key] || key;
  }

  t(key: string): string {
    return this.translate(key);
  }
}
