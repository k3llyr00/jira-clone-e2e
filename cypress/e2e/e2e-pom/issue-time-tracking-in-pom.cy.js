/*
if there are difficulties to pass the tests, 
please change following values in cypress.config.js file to:
    defaultCommandTimeout: 60000,
    requestTimeout: 60000,
*/

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
    // When new Issue is created, time tracking values are empty.
    IssueTimeTracking.validateEmptyTimeFields();

    // Add new ORIGINAL ESTIMATE (HOURS)
    IssueTimeTracking.addNewEstimation();

    // Log spent time
    IssueTimeTracking.logTime(
      IssueTimeTracking.randomTimeLogged,
      IssueTimeTracking.timeSpentInputInModal,
      "logged"
    );
    // Log remaining time
    IssueTimeTracking.logTime(
      IssueTimeTracking.randomRemaining,
      IssueTimeTracking.timeRemainingInputInModal,
      "remaining"
    );

    // Edit ORIGINAL ESTIMATE (HOURS)
    // Edit spent time
    // Edit remaining time

    // Delete ORIGINAL ESTIMATE (HOURS)
    // Delete spent time
    // Delete remaining time
  });
});
