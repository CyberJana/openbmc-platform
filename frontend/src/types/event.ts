export interface EventRecord {
  id?: string;
  message?: string;
  severity?: string;
  timestamp?: string;
}

export interface EventResponse {
  system_id: number;
  total: number;
  events: EventRecord[];
}
