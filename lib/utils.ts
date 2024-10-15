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
  // Technology-focused industries
  "Artificial Intelligence",
  "Software",
  "Hardware",
  "Cybersecurity",
  "Blockchain",
  "Gaming",
  "Biotechnology",
  "Space",
  "Renewable Energy",
  "Technology",

  // Technology-adjacent industries
  "Telecommunications",
  "E-commerce",
  "Media",
  "Entertainment",
  "Finance",
  "Healthcare",

  // Other industries
  "Retail",
  "Automotive",
  "Education",
  "Hospitality",
  "Manufacturing",
  "Real Estate",
  "Food and Beverage",
  "Travel",
  "Fashion",
  "Energy",
  "Construction",
  "Agriculture",
  "Transportation",
  "Pharmaceuticals",
  "Environmental",
  "Fitness",
  "Consulting",
  "Government",
  "Non-profit",
  "Insurance",
  "Legal",
  "Marketing",
  "Sports",
  "Beauty",
  "Design",
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
