import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject, takeUntil } from 'rxjs';
import { MonitoringService } from '../../core/services/monitoring.service';
import { SystemStats } from '../../core/models/system-stats.model';
import { MetricCard } from '../../shared/components/metric-card/metric-card';
import { ChartWidget } from '../../shared/components/chart-widget/chart-widget';

@Component({
  selector: 'app-system',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatGridListModule,
    MetricCard,
    ChartWidget
  ],
  templateUrl: './system.html',
  styleUrl: './system.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class System implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  systemStats: SystemStats | null = null;
  cpuHistory: { timestamp: Date; value: number }[] = [];
  memoryHistory: { timestamp: Date; value: number }[] = [];
  diskHistory: { timestamp: Date; value: number }[] = [];

  constructor(private monitoringService: MonitoringService) {}

  ngOnInit(): void {
    this.monitoringService.getSystemStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.systemStats = stats;
        if (stats) {
          this.updateHistory(stats);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateHistory(stats: SystemStats): void {
    // Add current stats to history (keep last 60 points)
    this.cpuHistory = [...this.cpuHistory, { timestamp: stats.timestamp, value: stats.cpu.usage }].slice(-60);
    this.memoryHistory = [...this.memoryHistory, { timestamp: stats.timestamp, value: stats.memory.usagePercent }].slice(-60);
    this.diskHistory = [...this.diskHistory, { timestamp: stats.timestamp, value: stats.disk.usagePercent }].slice(-60);
  }

  refresh(): void {
    this.monitoringService.refreshData();
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
