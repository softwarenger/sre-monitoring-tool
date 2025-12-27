import { Injectable } from '@angular/core';
import { Subscription, filter } from 'rxjs';
import { MonitoringService } from './monitoring.service';
import { HealthService } from './health.service';
import { MetricsService } from './metrics.service';
import { NotificationService } from './notification.service';
import { NotificationStoreService } from './notification-store.service';
import { NotificationItem } from '../models/notification.model';
import { MetricType } from '../models/metric.model';

@Injectable({ providedIn: 'root' })
export class NotificationTriggersService {
  constructor(
    private monitoring: MonitoringService,
    private health: HealthService,
    private metrics: MetricsService,
    private toast: NotificationService,
    private store: NotificationStoreService
  ) {}

  init(): Subscription {
    const subs = new Subscription();

    subs.add(
      this.monitoring.getSystemStats()
        .pipe(filter((s): s is NonNullable<typeof s> => !!s))
        .subscribe(stats => {
          if (stats.cpu.usage > 85) {
            this.notify('CPU Kritik', `CPU kullanımı %${Math.round(stats.cpu.usage)}`, 'critical', 'system');
          }
          if (stats.memory.usagePercent > 90) {
            this.notify('Bellek Yüksek', `Bellek kullanımı %${Math.round(stats.memory.usagePercent)}`, 'warning', 'system');
          }
        })
    );

    subs.add(
      this.health.getServices().subscribe(services => {
        services.forEach(s => {
          if (s.status === 'down') {
            this.notify('Servis Kapalı', `${s.name} şu anda erişilemiyor`, 'critical', 'service', s.id);
          }
          if (s.status === 'degraded') {
            this.notify('Servis Düşük Performans', `${s.name} performansı düşük`, 'warning', 'service', s.id);
          }
        });
      })
    );

    subs.add(
      this.metrics.getMetrics(undefined, MetricType.HTTP_ERROR_RATE, 1).subscribe(metrics => {
        metrics.forEach(m => {
          if (m.value > 5) {
            this.notify('HTTP Hata Oranı', `Hata oranı %${Math.round(m.value)}`, 'warning', 'metric', m.serviceId);
          }
        });
      })
    );

    return subs;
  }

  private notify(title: string, message: string, severity: 'info'|'warning'|'critical', type: 'system'|'service'|'metric'|'generic', source?: string) {
    const item: NotificationItem = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      title,
      message,
      severity,
      type,
      source,
      timestamp: Date.now(),
      read: false
    };
    this.store.add(item);
    if (severity === 'critical') this.toast.critical(message);
    else if (severity === 'warning') this.toast.warn(message);
    else this.toast.info(message);
  }
}
