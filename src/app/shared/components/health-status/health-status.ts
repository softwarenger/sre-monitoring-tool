import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { HealthStatus as HealthStatusEnum } from '../../../core/models/service-health.model';

@Component({
  selector: 'app-health-status',
  imports: [CommonModule, MatChipsModule, MatIconModule],
  templateUrl: './health-status.html',
  styleUrl: './health-status.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HealthStatus {
  @Input() status: HealthStatusEnum = HealthStatusEnum.UNKNOWN;
  @Input() showIcon: boolean = true;
  @Input() showText: boolean = true;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  get statusColor(): string {
    switch (this.status) {
      case HealthStatusEnum.HEALTHY:
        return 'primary';
      case HealthStatusEnum.DEGRADED:
        return 'accent';
      case HealthStatusEnum.DOWN:
        return 'warn';
      default:
        return '';
    }
  }

  get statusIcon(): string {
    switch (this.status) {
      case HealthStatusEnum.HEALTHY:
        return 'check_circle';
      case HealthStatusEnum.DEGRADED:
        return 'warning';
      case HealthStatusEnum.DOWN:
        return 'error';
      default:
        return 'help';
    }
  }

  get statusText(): string {
    switch (this.status) {
      case HealthStatusEnum.HEALTHY:
        return 'Sağlıklı';
      case HealthStatusEnum.DEGRADED:
        return 'Bozulmuş';
      case HealthStatusEnum.DOWN:
        return 'Çalışmıyor';
      default:
        return 'Bilinmiyor';
    }
  }

  get chipClass(): string {
    return `status-chip status-${this.status} size-${this.size}`;
  }
}
