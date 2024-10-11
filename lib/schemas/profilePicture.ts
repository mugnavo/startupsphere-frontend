/**
 * Generated by orval v7.1.1 🍺
 * Do not edit manually.
 * SphereFinVest API
 * API documentation for StartupVest, FinEase, and StartupSphere
 * OpenAPI spec version: 1.0
 */
import type { ProfilePictureData } from "./profilePictureData";
import type { Investor } from "./investor";
import type { Startup } from "./startup";
import type { User } from "./user";

export interface ProfilePicture {
  contentType: string;
  data: ProfilePictureData;
  id: number;
  investor: Investor;
  startup: Startup;
  user: User;
}
