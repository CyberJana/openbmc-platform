export interface SensorRecord {
  id?: string;
  name?: string;
  reading?: number;
  unit?: string;
}

export interface SensorResponse {
  system_id: number;
  total?: number;
  sensor_type?: string;
  sensors: SensorRecord[];
}
