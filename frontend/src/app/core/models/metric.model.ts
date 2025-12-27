export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  type: MetricType;
  serviceId?: string;
}

export enum MetricType {
  CPU = 'cpu',
  MEMORY = 'memory',
  DISK = 'disk',
  NETWORK = 'network',
  HTTP_RESPONSE_TIME = 'http_response_time',
  HTTP_ERROR_RATE = 'http_error_rate',
  HTTP_THROUGHPUT = 'http_throughput',
  CUSTOM = 'custom'
}

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
}

export interface MetricSeries {
  name: string;
  data: MetricDataPoint[];
  color?: string;
}
