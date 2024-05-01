import type { LocationData } from "../InteractiveMapContext";

export default class Startup {
  private id: number;
  private name: string;
  private coordinates: LocationData;
  private description: string | null;
  private location: string;
  private founderName: string | null;
  private websiteUrl: string | null;
  private logoUrl: string | null;
  private industry: string;
  private stage: string | null;
  private employees: string | null;
  private foundedDate: Date | null;
  private contactInfo: string | null;
  private likes: number;
  private favorites: number;
  private views: number;

  constructor(
    id: number,
    name: string,
    coordinates: LocationData,
    description: string | null,
    location: string,
    founderName: string | null,
    websiteUrl: string | null,
    logoUrl: string | null,
    industry: string,
    stage: string | null,
    employees: string | null,
    foundedDate: Date | null,
    contactInfo: string | null,
    likes: number,
    favorites: number,
    views: number
  ) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
    this.description = description;
    this.location = location;
    this.founderName = founderName;
    this.websiteUrl = websiteUrl;
    this.logoUrl = logoUrl;
    this.industry = industry;
    this.stage = stage;
    this.employees = employees;
    this.foundedDate = foundedDate;
    this.contactInfo = contactInfo;
    this.likes = likes;
    this.favorites = favorites;
    this.views = views;
  }

  // Getters
  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getCoordinates(): LocationData {
    return this.coordinates;
  }

  getDescription(): string | null {
    return this.description;
  }

  getLocation(): string {
    return this.location;
  }

  getFounderName(): string | null {
    return this.founderName;
  }

  getWebsiteUrl(): string | null {
    return this.websiteUrl;
  }

  getLogoUrl(): string | null {
    return this.logoUrl;
  }

  getIndustry(): string {
    return this.industry;
  }

  getStage(): string | null {
    return this.stage;
  }

  getEmployees(): string | null {
    return this.employees;
  }

  getFoundedDate(): Date | null {
    return this.foundedDate;
  }

  getContactInfo(): string | null {
    return this.contactInfo;
  }

  getLikes(): number {
    return this.likes;
  }

  getFavorites(): number {
    return this.favorites;
  }

  getViews(): number {
    return this.views;
  }

  // Setters
  setCoordinates(coordinates: LocationData): void {
    this.coordinates = coordinates;
  }

  setDescription(description: string | null): void {
    this.description = description;
  }

  setFounderName(founderName: string | null): void {
    this.founderName = founderName;
  }

  setWebsiteUrl(websiteUrl: string | null): void {
    this.websiteUrl = websiteUrl;
  }

  setLogoUrl(logoUrl: string | null): void {
    this.logoUrl = logoUrl;
  }

  setStage(stage: string | null): void {
    this.stage = stage;
  }

  setEmployees(employees: string | null): void {
    this.employees = employees;
  }

  setFoundedDate(foundedDate: Date | null): void {
    this.foundedDate = foundedDate;
  }

  setContactInfo(contactInfo: string | null): void {
    this.contactInfo = contactInfo;
  }

  incrementLikes(): void {
    this.likes++;
  }

  incrementFavorites(): void {
    this.favorites++;
  }

  incrementViews(): void {
    this.views++;
  }
}
