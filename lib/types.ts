export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

export interface DashboardSelection {
  active: boolean;
  startupName?: string;
  edit: boolean;
  previewLocation?: LocationData;
}
