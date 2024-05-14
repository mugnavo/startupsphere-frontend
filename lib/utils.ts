export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
export type MakeOptional<T, K extends keyof T> = Expand<Omit<T, K> & Partial<Pick<T, K>>>;

export function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const placeholderImageUrl =
  "https://utfs.io/f/6b66ba34-405b-4c82-abe3-4a658bccd9c1-4bu010.jpg";

export const withAuth = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwt")}`,
  },
};
