import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snack: MatSnackBar) {}

  info(message: string): void { this.snack.open(message, 'Kapat', { duration: 3000 }); }
  warn(message: string): void { this.snack.open(message, 'Kapat', { duration: 4000, panelClass: ['snack-warn'] }); }
  critical(message: string): void { this.snack.open(message, 'Kapat', { duration: 5000, panelClass: ['snack-critical'] }); }
}
