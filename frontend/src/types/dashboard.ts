export interface DashboardStatus {
  bmc_system_id: number;
  timestamp: string;
  status: string;
  message: string;
}

export interface DashboardMetrics {
  bmc_system_id: number;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  temperature_c: number;
  power_watts: number;
}
