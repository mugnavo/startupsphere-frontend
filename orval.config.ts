import "dotenv/config";
import { defineConfig } from "orval";

export default defineConfig({
  evo: {
    output: {
      mode: "single",
      target: "lib/api/index.ts",
      schemas: "lib/schemas",
      mock: false,
      prettier: true,
      clean: true,
      baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001",
    },
    input: {
      target: "http://localhost:3001/docs/spec.yaml",
    },
  },
});
