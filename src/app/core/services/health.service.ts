import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { MockDataService } from '../../mock-api/mock-data.service';
import { ServiceHealth, HealthStatus } from '../models/service-health.model';
import { Alert } from '../models/system-stats.model';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private servicesSubject = new BehaviorSubject<ServiceHealth[]>([]);
  private alertsSubject = new BehaviorSubject<Alert[]>([]);

  public services$ = this.servicesSubject.asObservable();
  public alerts$ = this.alertsSubject.asObservable();

  constructor(private mockDataService: MockDataService) {
    this.loadServices();
    this.loadAlerts();
  }

  private loadServices(): void {
    this.mockDataService.getServiceHealth().subscribe(services => {
      this.servicesSubject.next(services);
    });
  }

  private loadAlerts(): void {
    this.mockDataService.getAlerts().subscribe(alerts => {
      this.alertsSubject.next(alerts);
    });
  }

  getServices(): Observable<ServiceHealth[]> {
    return this.services$;
  }

  getServiceById(id: string): Observable<ServiceHealth | undefined> {
    return this.mockDataService.getServiceHealthById(id);
  }

  getAlerts(): Observable<Alert[]> {
    return this.alerts$;
  }

  getAlertsByService(serviceId: string): Observable<Alert[]> {
    return this.mockDataService.getAlertsByService(serviceId);
  }

  getHealthyServices(): Observable<ServiceHealth[]> {
    return new Observable(observer => {
      this.services$.subscribe(services => {
        const healthy = services.filter(s => s.status === HealthStatus.HEALTHY);
        observer.next(healthy);
      });
    });
  }

  getDegradedServices(): Observable<ServiceHealth[]> {
    return new Observable(observer => {
      this.services$.subscribe(services => {
        const degraded = services.filter(s => s.status === HealthStatus.DEGRADED);
        observer.next(degraded);
      });
    });
  }

  getDownServices(): Observable<ServiceHealth[]> {
    return new Observable(observer => {
      this.services$.subscribe(services => {
        const down = services.filter(s => s.status === HealthStatus.DOWN);
        observer.next(down);
      });
    });
  }

  refresh(): void {
    this.loadServices();
    this.loadAlerts();
  }

  getServiceStatusCount(): Observable<{ healthy: number; degraded: number; down: number; unknown: number }> {
    return new Observable(observer => {
      this.services$.subscribe(services => {
        const counts = {
          healthy: services.filter(s => s.status === HealthStatus.HEALTHY).length,
          degraded: services.filter(s => s.status === HealthStatus.DEGRADED).length,
          down: services.filter(s => s.status === HealthStatus.DOWN).length,
          unknown: services.filter(s => s.status === HealthStatus.UNKNOWN).length
        };
        observer.next(counts);
      });
    });
  }
}
