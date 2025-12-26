export type NotificationSeverity = 'info' | 'warning' | 'critical';
export type NotificationType = 'system' | 'service' | 'metric' | 'generic';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  type: NotificationType;
  source?: string; // e.g., serviceId or metricType
  timestamp: number;
  read: boolean;
}
