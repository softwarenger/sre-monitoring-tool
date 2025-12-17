import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { MonitoringService } from '../../core/services/monitoring.service';
import { MetricsService } from '../../core/services/metrics.service';
import { SystemStats } from '../../core/models/system-stats.model';
import { ServiceHealth } from '../../core/models/service-health.model';
import { Alert } from '../../core/models/system-stats.model';
import { MetricCard } from '../../shared/components/metric-card/metric-card';
import { ChartWidget } from '../../shared/components/chart-widget/chart-widget';
import { HealthStatus } from '../../shared/components/health-status/health-status';
import { MetricType } from '../../core/models/metric.model';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MetricCard,
    ChartWidget,
    HealthStatus
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  systemStats: SystemStats | null = null;
  services: ServiceHealth[] = [];
  alerts: Alert[] = [];
  cpuMetrics: { timestamp: Date; value: number }[] = [];
  memoryMetrics: { timestamp: Date; value: number }[] = [];
  httpResponseTimeMetrics: { timestamp: Date; value: number }[] = [];

  constructor(
    private monitoringService: MonitoringService,
    private metricsService: MetricsService
  ) {}

  ngOnInit(): void {
    // Subscribe to system stats
    this.monitoringService.getSystemStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe(stats => {
        this.systemStats = stats;
      });

    // Subscribe to services
    this.monitoringService.getServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(services => {
        this.services = services;
      });

    // Subscribe to alerts
    this.monitoringService.getAlerts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(alerts => {
        this.alerts = alerts;
      });

    // Load metrics for charts
    this.loadMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadMetrics(): void {
    // Load CPU metrics
    this.metricsService.getCpuMetrics(undefined, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.cpuMetrics = metrics.map(m => ({
          timestamp: m.timestamp,
          value: m.value
        }));
      });

    // Load Memory metrics
    this.metricsService.getMemoryMetrics(undefined, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.memoryMetrics = metrics.map(m => ({
          timestamp: m.timestamp,
          value: m.value
        }));
      });

    // Load HTTP Response Time metrics
    this.metricsService.getHttpResponseTimeMetrics(undefined, 1)
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.httpResponseTimeMetrics = metrics.map(m => ({
          timestamp: m.timestamp,
          value: m.value
        }));
      });
  }

  refresh(): void {
    this.monitoringService.refreshData();
    this.loadMetrics();
  }

  get healthyServicesCount(): number {
    return this.services.filter(s => s.status === 'healthy').length;
  }

  get degradedServicesCount(): number {
    return this.services.filter(s => s.status === 'degraded').length;
  }

  get downServicesCount(): number {
    return this.services.filter(s => s.status === 'down').length;
  }

  get criticalAlerts(): Alert[] {
    return this.alerts.filter(a => a.severity === 'critical' && !a.resolved);
  }
}
