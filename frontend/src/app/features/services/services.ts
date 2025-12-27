import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { Subject, takeUntil } from 'rxjs';
import { HealthService } from '../../core/services/health.service';
import { MetricsService } from '../../core/services/metrics.service';
import { ServiceHealth, HealthStatus } from '../../core/models/service-health.model';
import { ServiceMetrics } from '../../core/models/service-health.model';
import { HealthStatus as HealthStatusComponent } from '../../shared/components/health-status/health-status';
import { MetricCard } from '../../shared/components/metric-card/metric-card';

@Component({
  selector: 'app-services',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatExpansionModule,
    HealthStatusComponent,
    MetricCard
  ],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Services implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  services: ServiceHealth[] = [];
  selectedService: ServiceHealth | null = null;
  serviceMetrics: ServiceMetrics | null = null;
  
  displayedColumns: string[] = ['name', 'status', 'responseTime', 'uptime', 'version', 'actions'];

  constructor(
    private healthService: HealthService,
    private metricsService: MetricsService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadServices(): void {
    this.healthService.getServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(services => {
        this.services = services;
      });
  }

  selectService(service: ServiceHealth): void {
    this.selectedService = service;
    this.loadServiceMetrics(service.id);
  }

  private loadServiceMetrics(serviceId: string): void {
    this.metricsService.getServiceMetrics(serviceId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.serviceMetrics = metrics;
      });
  }

  refresh(): void {
    this.healthService.refresh();
    if (this.selectedService) {
      this.loadServiceMetrics(this.selectedService.id);
    }
  }

  getStatusColor(status: HealthStatus): string {
    switch (status) {
      case HealthStatus.HEALTHY:
        return 'primary';
      case HealthStatus.DEGRADED:
        return 'accent';
      case HealthStatus.DOWN:
        return 'warn';
      default:
        return '';
    }
  }
}
