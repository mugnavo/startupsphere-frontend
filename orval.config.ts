import "dotenv/config";
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    output: {
      mode: "single",
      target: "lib/api/index.ts",
      schemas: "lib/schemas",
      mock: false,
      prettier: true,
      clean: true,
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
      headers: true,
    },
    input: {
      target: `${process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000"}/docs/spec.yaml`,
    },
  },
});
