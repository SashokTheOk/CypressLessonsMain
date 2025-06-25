const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  defaultCommandTimeout: 5000,
  e2e: {
    baseUrl: "http://exampple.cypress.io",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})