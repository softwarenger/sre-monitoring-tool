import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MockDataService } from '../../mock-api/mock-data.service';
import { Metric, MetricType, MetricDataPoint } from '../models/metric.model';
import { ServiceMetrics } from '../models/service-health.model';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private metricsCache = new Map<string, Metric[]>();
  private metricsSubject = new BehaviorSubject<Metric[]>([]);
  public metrics$ = this.metricsSubject.asObservable();

  constructor(private mockDataService: MockDataService) {}

  getMetrics(serviceId?: string, type?: MetricType, hours: number = 1): Observable<Metric[]> {
    const cacheKey = `${serviceId || 'all'}-${type || 'all'}-${hours}`;
    
    // Return cached if available
    if (this.metricsCache.has(cacheKey)) {
      const cached = this.metricsCache.get(cacheKey)!;
      this.metricsSubject.next(cached);
      return new Observable(observer => {
        observer.next(cached);
        observer.complete();
      });
    }

    // Fetch new data
    return new Observable(observer => {
      this.mockDataService.getMetrics(serviceId, type, hours).subscribe(metrics => {
        this.metricsCache.set(cacheKey, metrics);
        this.metricsSubject.next(metrics);
        observer.next(metrics);
        observer.complete();
      });
    });
  }

  getMetricTimeSeries(serviceId: string, type: MetricType, hours: number = 1): Observable<MetricDataPoint[]> {
    return new Observable(observer => {
      this.getMetrics(serviceId, type, hours).subscribe(metrics => {
        const timeSeries: MetricDataPoint[] = metrics.map(m => ({
          timestamp: m.timestamp,
          value: m.value
        }));
        observer.next(timeSeries);
        observer.complete();
      });
    });
  }

  getServiceMetrics(serviceId: string): Observable<ServiceMetrics> {
    return this.mockDataService.getServiceMetrics(serviceId);
  }

  getLatestMetric(serviceId: string, type: MetricType): Observable<Metric | null> {
    return new Observable(observer => {
      this.getMetrics(serviceId, type, 1).subscribe(metrics => {
        const latest = metrics.length > 0 ? metrics[metrics.length - 1] : null;
        observer.next(latest);
        observer.complete();
      });
    });
  }

  clearCache(): void {
    this.metricsCache.clear();
  }

  getCpuMetrics(serviceId?: string, hours: number = 1): Observable<Metric[]> {
    return this.getMetrics(serviceId, MetricType.CPU, hours);
  }

  getMemoryMetrics(serviceId?: string, hours: number = 1): Observable<Metric[]> {
    return this.getMetrics(serviceId, MetricType.MEMORY, hours);
  }

  getDiskMetrics(serviceId?: string, hours: number = 1): Observable<Metric[]> {
    return this.getMetrics(serviceId, MetricType.DISK, hours);
  }

  getHttpResponseTimeMetrics(serviceId?: string, hours: number = 1): Observable<Metric[]> {
    return this.getMetrics(serviceId, MetricType.HTTP_RESPONSE_TIME, hours);
  }

  getHttpErrorRateMetrics(serviceId?: string, hours: number = 1): Observable<Metric[]> {
    return this.getMetrics(serviceId, MetricType.HTTP_ERROR_RATE, hours);
  }

  getHttpThroughputMetrics(serviceId?: string, hours: number = 1): Observable<Metric[]> {
    return this.getMetrics(serviceId, MetricType.HTTP_THROUGHPUT, hours);
  }
}
