export type Expand<T> = T extends unknown ? { [K in keyof T]: T[K] } : never;
export type MakeOptional<T, K extends keyof T> = Expand<Omit<T, K> & Partial<Pick<T, K>>>;

export function isValidEmail(email: string): boolean {
  return /.+@.+/.test(email);
}
