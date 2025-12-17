import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, interval, Subscription } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { MockDataService } from '../../mock-api/mock-data.service';
import { SystemStats } from '../models/system-stats.model';
import { ServiceHealth } from '../models/service-health.model';
import { Alert } from '../models/system-stats.model';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private refreshInterval = 5000; // 5 seconds
  private refreshSubscription?: Subscription;
  
  private systemStatsSubject = new BehaviorSubject<SystemStats | null>(null);
  private servicesSubject = new BehaviorSubject<ServiceHealth[]>([]);
  private alertsSubject = new BehaviorSubject<Alert[]>([]);

  public systemStats$ = this.systemStatsSubject.asObservable();
  public services$ = this.servicesSubject.asObservable();
  public alerts$ = this.alertsSubject.asObservable();

  constructor(private mockDataService: MockDataService) {
    this.startMonitoring();
  }

  startMonitoring(): void {
    // Initial load
    this.refreshData();

    // Set up polling
    this.refreshSubscription = interval(this.refreshInterval)
      .pipe(
        startWith(0),
        switchMap(() => {
          this.refreshData();
          return [];
        })
      )
      .subscribe();
  }

  stopMonitoring(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  setRefreshInterval(intervalMs: number): void {
    this.refreshInterval = intervalMs;
    this.stopMonitoring();
    this.startMonitoring();
  }

  refreshData(): void {
    // Load system stats
    this.mockDataService.getSystemStats().subscribe(stats => {
      this.systemStatsSubject.next(stats);
    });

    // Load services
    this.mockDataService.getServiceHealth().subscribe(services => {
      this.servicesSubject.next(services);
    });

    // Load alerts
    this.mockDataService.getAlerts().subscribe(alerts => {
      this.alertsSubject.next(alerts);
    });
  }

  getSystemStats(): Observable<SystemStats | null> {
    return this.systemStats$;
  }

  getServices(): Observable<ServiceHealth[]> {
    return this.services$;
  }

  getAlerts(): Observable<Alert[]> {
    return this.alerts$;
  }

  getServiceById(id: string): Observable<ServiceHealth | undefined> {
    return this.mockDataService.getServiceHealthById(id);
  }
}
