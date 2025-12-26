import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usersKey = 'users';
  private currentUserKey = 'currentUser';
  private currentUserSubject = new BehaviorSubject<User | null>(this.getCurrentUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    const users = this.getUsers();
    if (users.length === 0) {
      const demoUsers: User[] = [
        {
          id: '1',
          username: 'demo',
          password: 'demo123',
          email: 'demo@example.com'
        },
        {
          id: '2',
          username: 'admin',
          password: 'admin123',
          email: 'admin@example.com'
        }
      ];
      this.setUsers(demoUsers);
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  private setUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private getCurrentUser(): User | null {
    const user = localStorage.getItem(this.currentUserKey);
    return user ? JSON.parse(user) : null;
  }

  private setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.currentUserKey);
    }
    this.currentUserSubject.next(user);
  }

  register(user: User): boolean {
    const users = this.getUsers();
    if (users.find(u => u.username === user.username)) {
      return false; // Kullanıcı adı zaten var
    }
    users.push(user);
    this.setUsers(users);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      this.setCurrentUser(user);
      return true;
    }
    return false;
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  // Profile update: update name/email/avatar for current user
  updateProfile(partial: Partial<User>): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx === -1) return false;
    const updated: User = { ...users[idx], ...partial };
    users[idx] = updated;
    this.setUsers(users);
    this.setCurrentUser(updated);
    return true;
  }

  // Change password for current user with basic validation
  changePassword(oldPassword: string, newPassword: string): boolean {
    const current = this.getCurrentUser();
    if (!current) return false;
    if (current.password !== oldPassword) return false;
    if (!newPassword || newPassword.length < 4) return false;
    return this.updateProfile({ password: newPassword });
  }
}
