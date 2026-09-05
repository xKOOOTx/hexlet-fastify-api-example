import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "./tsp-output/@typespec/openapi3/openapi.json",
  output: "src/types/handlers",
  plugins: ["fastify", "zod"],
});