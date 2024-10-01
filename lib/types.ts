export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
}

export interface DashboardSelection {
  active: boolean;
  entityName?: string;
  edit: boolean;
  previewLocation?: LocationData;
}
