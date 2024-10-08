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

export const withAuth =
  typeof window === "undefined"
    ? undefined
    : {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("jwt")}`,
        },
      };

export const sectors = [
  "Agriculture",
  "Automotive",
  "Biotechnology",
  "Construction",
  "Consumer Goods",
  "Education",
  "Energy",
  "Entertainment",
  "Finance",
  "Food & Beverage",
  "Healthcare",
  "Hospitality",
  "Information Technology",
  "Manufacturing",
  "Media",
  "Real Estate",
  "Retail",
  "Telecommunication",
  "Transportation",
  "Travel",
  "Utilities",
  "Other",
];

export const investorTypes = [
  "Angel",
  "Corporate",
  "Venture Capitalist",
  "Crowdfunding",
  "Institution",
  "Accelerator",
  "Seed",
  "Strategic",
  "Impact",
  "Incubator",
];
