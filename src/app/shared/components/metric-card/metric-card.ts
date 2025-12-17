import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-metric-card',
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCard {
  @Input() title: string = '';
  @Input() value: number = 0;
  @Input() unit: string = '';
  @Input() icon: string = 'info';
  @Input() trend?: 'up' | 'down' | 'stable';
  @Input() color: 'primary' | 'accent' | 'warn' | '' = '';
  @Input() subtitle?: string;

  get displayValue(): string {
    if (this.unit === '%') {
      return `${this.value.toFixed(1)}${this.unit}`;
    }
    if (this.unit === 'ms') {
      return `${Math.round(this.value)}${this.unit}`;
    }
    if (this.unit === 'req/s') {
      return `${Math.round(this.value)}${this.unit}`;
    }
    return `${this.value.toFixed(2)}${this.unit}`;
  }

  get trendIcon(): string {
    switch (this.trend) {
      case 'up':
        return 'trending_up';
      case 'down':
        return 'trending_down';
      default:
        return 'trending_flat';
    }
  }

  get trendColor(): string {
    switch (this.trend) {
      case 'up':
        return 'warn';
      case 'down':
        return 'primary';
      default:
        return '';
    }
  }
}
