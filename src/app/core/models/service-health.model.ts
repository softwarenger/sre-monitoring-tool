export interface ServiceHealth {
  id: string;
  name: string;
  status: HealthStatus;
  lastCheck: Date;
  responseTime?: number;
  uptime?: number;
  version?: string;
  endpoint?: string;
  details?: HealthDetails;
}

export enum HealthStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  DOWN = 'down',
  UNKNOWN = 'unknown'
}

export interface HealthDetails {
  cpu?: number;
  memory?: number;
  disk?: number;
  activeConnections?: number;
  errorRate?: number;
  requestsPerSecond?: number;
}

export interface ServiceMetrics {
  serviceId: string;
  serviceName: string;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  timestamp: Date;
}
