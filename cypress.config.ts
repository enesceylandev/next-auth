import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: process.env.NEXTAUTH_URL || "http://localhost:3000", // fallback ekleyelim
    env: {
      auth0_username: process.env.NEXT_PUBLIC_AUTH0_TEST_USERNAME,
      auth0_password: process.env.NEXT_PUBLIC_AUTH0_TEST_PASSWORD,
      auth0_domain: process.env.NEXT_PUBLIC_AUTH0_ISSUER,
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
