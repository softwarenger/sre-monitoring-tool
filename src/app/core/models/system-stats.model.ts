export interface SystemStats {
  timestamp: Date;
  cpu: CpuStats;
  memory: MemoryStats;
  disk: DiskStats;
  network: NetworkStats;
}

export interface CpuStats {
  usage: number;
  cores: number;
  loadAverage: number[];
  processes: number;
}

export interface MemoryStats {
  total: number;
  used: number;
  free: number;
  cached: number;
  usagePercent: number;
}

export interface DiskStats {
  total: number;
  used: number;
  free: number;
  usagePercent: number;
  readBytes: number;
  writeBytes: number;
  readOps: number;
  writeOps: number;
}

export interface NetworkStats {
  bytesIn: number;
  bytesOut: number;
  packetsIn: number;
  packetsOut: number;
  errorsIn: number;
  errorsOut: number;
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  serviceId?: string;
  metricType?: string;
  resolved: boolean;
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical'
}
