export interface DashboardWidgetConfig {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: 'tr' | 'en';
  timezone: string;
  dashboardLayout: DashboardWidgetConfig[];
}
