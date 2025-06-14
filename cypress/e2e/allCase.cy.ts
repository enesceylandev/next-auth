describe("All the tests for the website", () => {
  describe("Unauthenticated Tests", () => {
    it("Check all the components are rendered in the login page", () => {
      cy.visit("http://localhost:3000/");
      cy.get('[data-testid="login-component"]').should("exist");
      cy.get('[data-testid="login-title"]')
        .should("exist")
        .should("have.text", "You are not logged in");
      cy.get('[data-testid="login-button"]').should("exist");
    });
  });

  describe("Authenticated Tests", () => {
    beforeEach(() => {
      cy.loginWithAuth0();
    });

    describe("With user role", () => {
      it("Check can we logout", () => {
        cy.get('[data-testid="user-button"]').should("exist").click();
        cy.get('[data-testid="logout-button"]').should("exist").click();
      });

      it("Change role and check permissions", () => {
        cy.get('[data-testid="user-button"]')
          .should("exist")
          .should("be.visible")
          .click();

        cy.get('[data-testid="change-role-button"]')
          .should("exist")
          .should("be.visible")
          .click();

        cy.get('[data-testid="current-role"]')
          .should("exist")
          .should("be.visible")
          .invoke("text")
          .then(currentRole => {
            if (currentRole.includes("Admin")) {
              cy.get('[data-testid="change-role-to-User"]')
                .should("exist")
                .click();

              cy.wait(3000);
              cy.get('[data-testid="cannot-access-card"]').should("exist");
            } else {
              cy.get('[data-testid="change-role-to-Admin"]')
                .should("exist")
                .click();

              cy.wait(3000);
              cy.get('[data-testid="protected-cards"]').should("exist");
            }
          });

        cy.get('[data-testid="change-role-button"]')
          .should("exist")
          .should("be.visible")
          .click();

        cy.get('[data-testid="current-role"]')
          .should("exist")
          .should("be.visible")
          .invoke("text")
          .then(currentRole => {
            if (currentRole.includes("Admin")) {
              cy.get('[data-testid="change-role-to-User"]')
                .should("exist")
                .click();

              cy.wait(3000);
              cy.get('[data-testid="cannot-access-card"]').should("exist");
            } else {
              cy.get('[data-testid="change-role-to-Admin"]')
                .should("exist")
                .click();

              cy.wait(3000);
              cy.get('[data-testid="protected-cards"]').should("exist");
            }
          });
      });
    });
  });
});
