import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MetricsService } from '../../core/services/metrics.service';
import { MonitoringService } from '../../core/services/monitoring.service';
import { Metric, MetricType } from '../../core/models/metric.model';
import { ChartWidget } from '../../shared/components/chart-widget/chart-widget';

@Component({
  selector: 'app-metrics',
  imports: [
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ChartWidget
  ],
  templateUrl: './metrics.html',
  styleUrl: './metrics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Metrics implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedService: string = 'all';
  selectedMetricType: MetricType = MetricType.CPU;
  selectedHours: number = 1;
  
  services: { id: string; name: string }[] = [];
  metrics: Metric[] = [];
  chartData: { timestamp: Date; value: number }[] = [];

  metricTypes = [
    { value: MetricType.CPU, label: 'CPU Kullanımı' },
    { value: MetricType.MEMORY, label: 'Bellek Kullanımı' },
    { value: MetricType.DISK, label: 'Disk Kullanımı' },
    { value: MetricType.HTTP_RESPONSE_TIME, label: 'HTTP Yanıt Süresi' },
    { value: MetricType.HTTP_ERROR_RATE, label: 'HTTP Hata Oranı' },
    { value: MetricType.HTTP_THROUGHPUT, label: 'HTTP Throughput' }
  ];

  hoursOptions = [1, 6, 12, 24];

  constructor(
    private metricsService: MetricsService,
    private monitoringService: MonitoringService
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadMetrics();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadServices(): void {
    this.monitoringService.getServices()
      .pipe(takeUntil(this.destroy$))
      .subscribe(services => {
        this.services = [
          { id: 'all', name: 'Tüm Servisler' },
          ...services.map(s => ({ id: s.id, name: s.name }))
        ];
      });
  }

  private loadMetrics(): void {
    const serviceId = this.selectedService === 'all' ? undefined : this.selectedService;
    
    this.metricsService.getMetrics(serviceId, this.selectedMetricType, this.selectedHours)
      .pipe(takeUntil(this.destroy$))
      .subscribe(metrics => {
        this.metrics = metrics;
        this.chartData = metrics.map(m => ({
          timestamp: m.timestamp,
          value: m.value
        }));
      });
  }

  onServiceChange(): void {
    this.loadMetrics();
  }

  onMetricTypeChange(): void {
    this.loadMetrics();
  }

  onHoursChange(): void {
    this.loadMetrics();
  }

  get chartTitle(): string {
    const serviceName = this.selectedService === 'all' 
      ? 'Tüm Servisler' 
      : this.services.find(s => s.id === this.selectedService)?.name || '';
    const metricLabel = this.metricTypes.find(t => t.value === this.selectedMetricType)?.label || '';
    return `${metricLabel} - ${serviceName} (Son ${this.selectedHours} Saat)`;
  }

  get chartColor(): string {
    switch (this.selectedMetricType) {
      case MetricType.CPU:
        return '#3f51b5';
      case MetricType.MEMORY:
        return '#f44336';
      case MetricType.DISK:
        return '#ff9800';
      case MetricType.HTTP_RESPONSE_TIME:
        return '#4caf50';
      case MetricType.HTTP_ERROR_RATE:
        return '#e91e63';
      case MetricType.HTTP_THROUGHPUT:
        return '#00bcd4';
      default:
        return '#3f51b5';
    }
  }

  get chartLabel(): string {
    return this.metricTypes.find(t => t.value === this.selectedMetricType)?.label || 'Değer';
  }

  exportMetrics(): void {
    const csv = this.convertToCSV(this.metrics);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metrics-${this.selectedMetricType}-${new Date().getTime()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(metrics: Metric[]): string {
    const headers = ['Timestamp', 'Name', 'Value', 'Unit', 'Type', 'Service ID'];
    const rows = metrics.map(m => [
      m.timestamp.toISOString(),
      m.name,
      m.value.toString(),
      m.unit,
      m.type,
      m.serviceId || ''
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
