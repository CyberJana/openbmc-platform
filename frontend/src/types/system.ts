export interface BmcSystem {
  id: number;
  name: string;
  host: string;
  health_status: string;
  firmware_version?: string | null;
  bios_version?: string | null;
  is_active: boolean;
}

export interface BmcSystemListResponse {
  total: number;
  systems: BmcSystem[];
}
