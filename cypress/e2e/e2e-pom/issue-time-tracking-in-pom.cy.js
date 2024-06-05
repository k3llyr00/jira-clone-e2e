import IssueTimeTracking from "../../pages/IssueTimeTracking.js";

describe("Issue time tracking with POM approach", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");

        // Creating new issue for testing the Time tracking functionality
        IssueTimeTracking.createIssue(
          IssueTimeTracking.randomDescription,
          IssueTimeTracking.randomTitle
        );

        // Wait for a key element to be visible to ensure the page is fully loaded
        cy.wait(6000);
        cy.get(IssueTimeTracking.listIssue, IssueTimeTracking.timeout).should(
          "be.visible"
        );

        // Ensure the issue title is present before clicking
        cy.contains(IssueTimeTracking.randomTitle, IssueTimeTracking.timeout)
          .should("be.visible")
          .click();
      });
  });

  it("Adding, editing and removing the estimation", () => {
    IssueTimeTracking.validateEmptyEstimation();
    IssueTimeTracking.addNewEstimation();
  });
});
