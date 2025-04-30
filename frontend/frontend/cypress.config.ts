import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1000,
    viewportHeight: 660,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // Aici poți configura evenimente personalizate, dacă este necesar
    }
  }
});
