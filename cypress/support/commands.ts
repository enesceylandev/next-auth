/// <reference types="cypress" />

Cypress.Commands.add("loginWithAuth0", () => {
  const auth0Domain = Cypress.env("auth0_domain");
  const username = Cypress.env("auth0_test_username");
  const password = Cypress.env("auth0_test_password");

  cy.visit("/");
  cy.get('[data-testid="login-button"]').click();

  cy.origin(
    auth0Domain,
    { args: { username, password } },
    ({ username, password }) => {
      cy.get("#username")
        .should("be.visible")
        .type(username)
        .should("have.value", username);

      cy.get("#password")
        .should("be.visible")
        .type(password)
        .should("have.value", password);

      cy.get(".c9c799e5a.ce85f8434.cd8fff5bc.cee74f62a.c67eaff10")
        .should("have.attr", "type", "submit")
        .click();
    }
  );

  cy.contains("button.button", "Sign in with Auth0")
    .should("be.visible")
    .click();
});

declare global {
  namespace Cypress {
    interface Chainable {
      loginWithAuth0(): Chainable<void>;
    }
  }
}

export {};
