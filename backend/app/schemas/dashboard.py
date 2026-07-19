"""Dashboard Pydantic schemas."""

from typing import Optional, Dict, Any
from datetime import datetime

from pydantic import BaseModel, Field


class CPUMetrics(BaseModel):
    """CPU metrics schema."""

    current_percent: float = Field(..., description="Current CPU usage percentage")
    average_percent: float = Field(..., description="Average CPU usage")
    trend: str = Field(default="stable", description="Usage trend")


class MemoryMetrics(BaseModel):
    """Memory metrics schema."""

    total_mb: float
    used_mb: float
    available_mb: float
    percent_used: float


class TemperatureMetrics(BaseModel):
    """Temperature metrics schema."""

    current_c: float
    min_c: float
    max_c: float
    warning_threshold_c: float
    critical_threshold_c: float


class FanMetrics(BaseModel):
    """Fan metrics schema."""

    speed_rpm: int
    speed_percent: float
    status: str


class PowerMetrics(BaseModel):
    """Power metrics schema."""

    current_watts: float
    average_watts: float
    peak_watts: float


class SystemHealthStatus(BaseModel):
    """System health status schema."""

    status: str = Field(description="Overall health status")
    critical_issues: int
    warning_issues: int
    last_check: datetime


class DashboardStatusResponse(BaseModel):
    """Dashboard status response schema."""

    bmc_system_id: int
    system_name: str
    firmware_version: str
    bios_version: str
    uptime_hours: float
    health_status: SystemHealthStatus
    cpu: CPUMetrics
    memory: MemoryMetrics
    temperature: TemperatureMetrics
    fans: list[FanMetrics]
    power: PowerMetrics
    timestamp: datetime


class MetricsDataPoint(BaseModel):
    """Single metrics data point."""

    timestamp: datetime
    value: float


class MetricsHistory(BaseModel):
    """Metrics history schema."""

    metric_name: str
    unit: str
    data_points: list[MetricsDataPoint]
    min_value: float
    max_value: float
    average_value: float


class DashboardMetricsResponse(BaseModel):
    """Dashboard metrics response schema."""

    bmc_system_id: int
    cpu_history: MetricsHistory
    memory_history: MetricsHistory
    temperature_history: MetricsHistory
    power_history: MetricsHistory


class HealthCheckResponse(BaseModel):
    """Health check response schema."""

    status: str
    version: str
    environment: str
    timestamp: datetime