export interface User {
  id: number;
  email: string;
  full_name: string | null;
  is_active: boolean;
  is_superadmin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface TokenRefreshResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface BMCSystem {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  password: string;
  verify_ssl: boolean;
  firmware_version: string | null;
  bios_version: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  model: string | null;
  cpu_count: number | null;
  memory_gb: number | null;
  is_active: boolean;
  last_health_check: string | null;
  health_status: string;
  created_at: string;
  updated_at: string;
}

export interface BMCSystemListResponse {
  total: number;
  systems: BMCSystem[];
}

export interface UserListResponse {
  total: number;
  users: User[];
}

export interface DashboardStatusResponse {
  bmc_system_id: number;
  timestamp: string;
  status: string;
  message: string;
}

export interface DashboardMetricsResponse {
  bmc_system_id: number;
  timestamp: string;
  cpu_usage: number;
  memory_usage: number;
  temperature_c: number;
  power_watts: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  environment: string;
  timestamp: string;
}

export interface EventsResponse {
  system_id: number;
  total: number;
  events: Array<{
    id: number;
    severity: string;
    message: string;
    event_type: string;
    source?: string;
    event_timestamp?: string;
  }>;
}

export interface EventSummaryResponse {
  system_id: number;
  critical_count: number;
  warning_count: number;
  info_count: number;
  total_count: number;
}

export interface SensorsResponse {
  system_id: number;
  total?: number;
  sensor_type?: string;
  sensors: Array<{
    id: number;
    name: string;
    sensor_type: string;
    unit?: string;
    location?: string;
    reading?: number;
    status?: string;
    lower_threshold?: number;
    upper_threshold?: number;
  }>;
}
