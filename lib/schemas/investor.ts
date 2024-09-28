/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * StartupSphere API
 * API documentation for StartupSphere, the 3D mapping platform for startup ecosystems.
 * OpenAPI spec version: 1.0
 */

export interface Investor {
  contactInfo: string;
  description: string;
  id: number;
  investment_focus: string;
  locationLat: number;
  locationLng: number;
  locationName: string;
  logoUrl: string;
  managerId?: number;
  name: string;
  total_funds: number;
  type: string;
  websiteUrl: string;
}
