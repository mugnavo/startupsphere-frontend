export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
export type MakeOptional<T, K extends keyof T> = Expand<Omit<T, K> & Partial<Pick<T, K>>>;

export function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const placeholderImageUrl =
  "https://utfs.io/f/bf5db33a-fd1e-4884-a221-79d8ce511452-9w6i5v.png";

export const withAuth = {
  headers: {
    Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
  },
};
