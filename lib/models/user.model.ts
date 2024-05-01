export default class User {
  private id: string;
  private email: string;
  private hashedPassword: string;
  private coordinates: any;
  private avatarUrl: string | null;
  private firstName: string;
  private lastName: string;
  private location: string;
  private investor: boolean;
  private moderator: boolean;

  constructor(
    id: string,
    email: string,
    hashedPassword: string,
    coordinates: any,
    avatarUrl: string | null,
    firstName: string,
    lastName: string,
    location: string,
    investor: boolean,
    moderator: boolean
  ) {
    this.id = id;
    this.email = email;
    this.hashedPassword = hashedPassword;
    this.coordinates = coordinates;
    this.avatarUrl = avatarUrl;
    this.firstName = firstName;
    this.lastName = lastName;
    this.location = location;
    this.investor = investor;
    this.moderator = moderator;
  }

  // Getters
  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getHashedPassword(): string {
    return this.hashedPassword;
  }

  getCoordinates(): any {
    return this.coordinates;
  }

  getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getLocation(): string {
    return this.location;
  }

  isInvestor(): boolean {
    return this.investor;
  }

  isModerator(): boolean {
    return this.moderator;
  }

  // Setters
  setCoordinates(coordinates: any): void {
    this.coordinates = coordinates;
  }

  setAvatarUrl(avatarUrl: string | null): void {
    this.avatarUrl = avatarUrl;
  }
}
