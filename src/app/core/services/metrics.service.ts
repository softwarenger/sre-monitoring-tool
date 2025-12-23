import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError, catchError, tap, of, map } from 'rxjs';
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
    // Always fetch fresh data for live updates
    return this.mockDataService.getMetrics(serviceId, type, hours).pipe(
      tap((metrics: Metric[]) => {
        this.metricsSubject.next(metrics);
      }),
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
 getMetricTimeSeries(
  serviceId: string,
  type: MetricType,
  hours: number = 1
): Observable<MetricDataPoint[]> {
  return this.getMetrics(serviceId, type, hours).pipe(
    map((metrics: any[]) =>
      metrics.map(m => ({
        timestamp: m.timestamp,
        value: m.value
      }))
    )
  );
}

  getServiceMetrics(serviceId: string): Observable<ServiceMetrics> {
    return this.mockDataService.getServiceMetrics(serviceId);
  }

  getLatestMetric(
  serviceId: string,
  type: MetricType
): Observable<Metric | null> {
  return this.getMetrics(serviceId, type, 1).pipe(
    map(metrics =>
      metrics.length > 0 ? metrics[metrics.length - 1] : null
    )
  );
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
