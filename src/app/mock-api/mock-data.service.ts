import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Metric, MetricType, MetricDataPoint } from '../core/models/metric.model';
import { ServiceHealth, HealthStatus, ServiceMetrics } from '../core/models/service-health.model';
import { SystemStats, Alert, AlertSeverity } from '../core/models/system-stats.model';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private services: ServiceHealth[] = [
    {
      id: 'svc-1',
      name: 'User Service',
      status: HealthStatus.HEALTHY,
      lastCheck: new Date(),
      responseTime: 45,
      uptime: 99.9,
      version: '2.1.0',
      endpoint: 'https://api.example.com/users',
      details: {
        cpu: 35,
        memory: 60,
        disk: 45,
        activeConnections: 1250,
        errorRate: 0.1,
        requestsPerSecond: 450
      }
    },
    {
      id: 'svc-2',
      name: 'Payment Service',
      status: HealthStatus.HEALTHY,
      lastCheck: new Date(),
      responseTime: 120,
      uptime: 99.8,
      version: '1.5.2',
      endpoint: 'https://api.example.com/payments',
      details: {
        cpu: 55,
        memory: 75,
        disk: 30,
        activeConnections: 890,
        errorRate: 0.05,
        requestsPerSecond: 320
      }
    },
    {
      id: 'svc-3',
      name: 'Order Service',
      status: HealthStatus.DEGRADED,
      lastCheck: new Date(),
      responseTime: 350,
      uptime: 98.5,
      version: '3.0.1',
      endpoint: 'https://api.example.com/orders',
      details: {
        cpu: 85,
        memory: 90,
        disk: 65,
        activeConnections: 2100,
        errorRate: 2.5,
        requestsPerSecond: 680
      }
    },
    {
      id: 'svc-4',
      name: 'Notification Service',
      status: HealthStatus.HEALTHY,
      lastCheck: new Date(),
      responseTime: 25,
      uptime: 99.95,
      version: '1.2.0',
      endpoint: 'https://api.example.com/notifications',
      details: {
        cpu: 20,
        memory: 40,
        disk: 25,
        activeConnections: 450,
        errorRate: 0.02,
        requestsPerSecond: 1200
      }
    },
    {
      id: 'svc-5',
      name: 'Analytics Service',
      status: HealthStatus.DOWN,
      lastCheck: new Date(Date.now() - 300000),
      responseTime: undefined,
      uptime: 95.2,
      version: '2.0.0',
      endpoint: 'https://api.example.com/analytics',
      details: undefined
    }
  ];

  private alerts: Alert[] = [
    {
      id: 'alert-1',
      severity: AlertSeverity.WARNING,
      message: 'Order Service CPU usage above 80%',
      timestamp: new Date(Date.now() - 600000),
      serviceId: 'svc-3',
      metricType: 'cpu',
      resolved: false
    },
    {
      id: 'alert-2',
      severity: AlertSeverity.ERROR,
      message: 'Analytics Service is down',
      timestamp: new Date(Date.now() - 300000),
      serviceId: 'svc-5',
      resolved: false
    },
    {
      id: 'alert-3',
      severity: AlertSeverity.INFO,
      message: 'Payment Service response time increased',
      timestamp: new Date(Date.now() - 1200000),
      serviceId: 'svc-2',
      metricType: 'http_response_time',
      resolved: true
    }
  ];

  constructor() {
    // Simulate data changes over time
    setInterval(() => this.updateMockData(), 5000);
  }

  private updateMockData(): void {
    // Update service health with slight variations
    this.services.forEach(service => {
      if (service.status !== HealthStatus.DOWN && service.details) {
        service.details.cpu = Math.max(10, Math.min(95, service.details.cpu! + (Math.random() - 0.5) * 5));
        service.details.memory = Math.max(20, Math.min(95, service.details.memory! + (Math.random() - 0.5) * 3));
        service.details.disk = Math.max(10, Math.min(90, service.details.disk! + (Math.random() - 0.5) * 2));
        service.responseTime = Math.max(20, service.responseTime! + (Math.random() - 0.5) * 10);
        service.lastCheck = new Date();

        // Update status based on metrics
        if (service.details.cpu > 85 || service.details.memory > 90) {
          service.status = HealthStatus.DEGRADED;
        } else if (service.details.errorRate && service.details.errorRate > 5) {
          service.status = HealthStatus.DEGRADED;
        } else {
          service.status = HealthStatus.HEALTHY;
        }
      }
    });
  }

  getSystemStats(): Observable<SystemStats> {
    const now = new Date();
    const stats: SystemStats = {
      timestamp: now,
      cpu: {
        usage: 45 + Math.random() * 20,
        cores: 8,
        loadAverage: [1.2, 1.5, 1.8],
        processes: 245 + Math.floor(Math.random() * 50)
      },
      memory: {
        total: 32 * 1024 * 1024 * 1024, // 32 GB
        used: (18 + Math.random() * 4) * 1024 * 1024 * 1024,
        free: (10 - Math.random() * 2) * 1024 * 1024 * 1024,
        cached: (2 + Math.random() * 1) * 1024 * 1024 * 1024,
        usagePercent: 55 + Math.random() * 15
      },
      disk: {
        total: 500 * 1024 * 1024 * 1024, // 500 GB
        used: (250 + Math.random() * 50) * 1024 * 1024 * 1024,
        free: (200 - Math.random() * 50) * 1024 * 1024 * 1024,
        usagePercent: 50 + Math.random() * 10,
        readBytes: Math.floor(Math.random() * 1000000000),
        writeBytes: Math.floor(Math.random() * 500000000),
        readOps: Math.floor(Math.random() * 10000),
        writeOps: Math.floor(Math.random() * 5000)
      },
      network: {
        bytesIn: Math.floor(Math.random() * 10000000000),
        bytesOut: Math.floor(Math.random() * 5000000000),
        packetsIn: Math.floor(Math.random() * 1000000),
        packetsOut: Math.floor(Math.random() * 500000),
        errorsIn: Math.floor(Math.random() * 100),
        errorsOut: Math.floor(Math.random() * 50)
      }
    };
    return of(stats).pipe(delay(300));
  }

  getServiceHealth(): Observable<ServiceHealth[]> {
    return of([...this.services]).pipe(delay(200));
  }

  getServiceHealthById(id: string): Observable<ServiceHealth | undefined> {
    const service = this.services.find(s => s.id === id);
    return of(service).pipe(delay(200));
  }

  getMetrics(serviceId?: string, type?: MetricType, hours: number = 1): Observable<Metric[]> {
    const now = new Date();
    const metrics: Metric[] = [];
    const points = hours * 12; // 5-minute intervals

    const services = serviceId ? [serviceId] : ['svc-1', 'svc-2', 'svc-3', 'svc-4'];
    const types = type ? [type] : [MetricType.CPU, MetricType.MEMORY, MetricType.DISK, MetricType.HTTP_RESPONSE_TIME];

    services.forEach(svcId => {
      types.forEach(metricType => {
        for (let i = 0; i < points; i++) {
          const timestamp = new Date(now.getTime() - (points - i) * 5 * 60 * 1000);
          let value = 0;
          let unit = '';

          switch (metricType) {
            case MetricType.CPU:
              value = 30 + Math.random() * 50 + Math.sin(i / 10) * 10;
              unit = '%';
              break;
            case MetricType.MEMORY:
              value = 40 + Math.random() * 40 + Math.sin(i / 8) * 15;
              unit = '%';
              break;
            case MetricType.DISK:
              value = 45 + Math.random() * 20;
              unit = '%';
              break;
            case MetricType.HTTP_RESPONSE_TIME:
              value = 50 + Math.random() * 200 + Math.sin(i / 5) * 50;
              unit = 'ms';
              break;
            case MetricType.HTTP_ERROR_RATE:
              value = Math.random() * 2;
              unit = '%';
              break;
            case MetricType.HTTP_THROUGHPUT:
              value = 300 + Math.random() * 400;
              unit = 'req/s';
              break;
          }

          metrics.push({
            id: `metric-${svcId}-${metricType}-${i}`,
            name: `${metricType} - ${svcId}`,
            value: Math.round(value * 100) / 100,
            unit,
            timestamp,
            type: metricType,
            serviceId: svcId
          });
        }
      });
    });

    return of(metrics).pipe(delay(400));
  }

  getMetricTimeSeries(serviceId: string, type: MetricType, hours: number = 1): Observable<MetricDataPoint[]> {
    return this.getMetrics(serviceId, type, hours).pipe(
      delay(200),
      // Transform to time series
      // This would be done in the service, but for simplicity returning as Observable
    );
  }

  getServiceMetrics(serviceId: string): Observable<ServiceMetrics> {
    const service = this.services.find(s => s.id === serviceId);
    const metrics: ServiceMetrics = {
      serviceId,
      serviceName: service?.name || 'Unknown',
      metrics: {
        cpu: service?.details?.cpu || 0,
        memory: service?.details?.memory || 0,
        disk: service?.details?.disk || 0,
        responseTime: service?.responseTime || 0,
        errorRate: service?.details?.errorRate || 0,
        throughput: service?.details?.requestsPerSecond || 0
      },
      timestamp: new Date()
    };
    return of(metrics).pipe(delay(200));
  }

  getAlerts(): Observable<Alert[]> {
    return of([...this.alerts]).pipe(delay(150));
  }

  getAlertsByService(serviceId: string): Observable<Alert[]> {
    const filtered = this.alerts.filter(a => a.serviceId === serviceId);
    return of(filtered).pipe(delay(150));
  }
}
