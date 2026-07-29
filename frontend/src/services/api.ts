import type {
  BMCSystem,
  BMCSystemListResponse,
  DashboardMetricsResponse,
  DashboardStatusResponse,
  EventSummaryResponse,
  EventsResponse,
  HealthResponse,
  LoginResponse,
  SensorsResponse,
  TokenRefreshResponse,
  User,
  UserListResponse,
} from "../types";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined) ??
  (import.meta.env.REACT_APP_API_URL as string | undefined) ??
  "http://localhost:8000/api/v1";

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: RequestMethod;
  token?: string;
  body?: unknown;
}

export class ApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const data = (await response.json()) as { detail?: string };
      if (data.detail) {
        errorMessage = data.detail;
      }
    } catch {
      // Keep default message when body is not JSON.
    }
    throw new ApiError(errorMessage, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  auth: {
    login(email: string, password: string): Promise<LoginResponse> {
      return request<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
    },
    refresh(refresh_token: string): Promise<TokenRefreshResponse> {
      return request<TokenRefreshResponse>("/auth/refresh", {
        method: "POST",
        body: { refresh_token },
      });
    },
    logout(token: string): Promise<{ message: string }> {
      return request<{ message: string }>("/auth/logout", {
        method: "POST",
        token,
      });
    },
  },
  systems: {
    list(token: string, skip = 0, limit = 100): Promise<BMCSystemListResponse> {
      return request<BMCSystemListResponse>(`/systems?skip=${skip}&limit=${limit}`, { token });
    },
    create(
      token: string,
      payload: Pick<BMCSystem, "name" | "host" | "port" | "username" | "password" | "verify_ssl">,
    ): Promise<BMCSystem> {
      return request<BMCSystem>("/systems", { method: "POST", token, body: payload });
    },
    update(
      token: string,
      id: number,
      payload: Partial<Pick<BMCSystem, "name" | "host" | "port" | "username" | "password" | "verify_ssl" | "is_active">>,
    ): Promise<BMCSystem> {
      return request<BMCSystem>(`/systems/${id}`, { method: "PUT", token, body: payload });
    },
    remove(token: string, id: number): Promise<void> {
      return request<void>(`/systems/${id}`, { method: "DELETE", token });
    },
    healthCheck(token: string, id: number): Promise<{ system_id: number; health_status: string }> {
      return request<{ system_id: number; health_status: string }>(`/systems/${id}/health-check`, {
        method: "POST",
        token,
      });
    },
  },
  users: {
    list(token: string, skip = 0, limit = 100): Promise<UserListResponse> {
      return request<UserListResponse>(`/users?skip=${skip}&limit=${limit}`, { token });
    },
    create(token: string, payload: { email: string; full_name?: string; password: string }): Promise<User> {
      return request<User>("/users", {
        method: "POST",
        token,
        body: payload,
      });
    },
    update(token: string, id: number, payload: { full_name?: string; password?: string }): Promise<User> {
      return request<User>(`/users/${id}`, {
        method: "PUT",
        token,
        body: payload,
      });
    },
    remove(token: string, id: number): Promise<void> {
      return request<void>(`/users/${id}`, { method: "DELETE", token });
    },
  },
  dashboard: {
    status(token: string, systemId: number): Promise<DashboardStatusResponse> {
      return request<DashboardStatusResponse>(`/dashboard/status?system_id=${systemId}`, { token });
    },
    metrics(token: string, systemId: number): Promise<DashboardMetricsResponse> {
      return request<DashboardMetricsResponse>(`/dashboard/metrics?system_id=${systemId}`, { token });
    },
    health(token: string, systemId: number): Promise<HealthResponse> {
      return request<HealthResponse>(`/dashboard/health?system_id=${systemId}`, { token });
    },
  },
  sensors: {
    all(token: string, systemId: number): Promise<SensorsResponse> {
      return request<SensorsResponse>(`/sensors?system_id=${systemId}`, { token });
    },
    temperature(token: string, systemId: number): Promise<SensorsResponse> {
      return request<SensorsResponse>(`/sensors/temperature?system_id=${systemId}`, { token });
    },
    fans(token: string, systemId: number): Promise<SensorsResponse> {
      return request<SensorsResponse>(`/sensors/fans?system_id=${systemId}`, { token });
    },
    power(token: string, systemId: number): Promise<SensorsResponse> {
      return request<SensorsResponse>(`/sensors/power?system_id=${systemId}`, { token });
    },
  },
  events: {
    list(token: string, systemId: number, skip = 0, limit = 100): Promise<EventsResponse> {
      return request<EventsResponse>(`/events?system_id=${systemId}&skip=${skip}&limit=${limit}`, { token });
    },
    summary(token: string, systemId: number): Promise<EventSummaryResponse> {
      return request<EventSummaryResponse>(`/events/summary?system_id=${systemId}`, { token });
    },
  },
};
