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
    IssueTimeTracking.addNewEstimation(false);

    // Log spent time
    IssueTimeTracking.logTime(
      false,
      IssueTimeTracking.randomTimeLogged,
      IssueTimeTracking.timeSpentInputInModal,
      "logged"
    );
    // Log remaining time
    IssueTimeTracking.logTime(
      true,
      IssueTimeTracking.randomRemaining,
      IssueTimeTracking.timeRemainingInputInModal,
      "remaining"
    );

    // Edit ORIGINAL ESTIMATE (HOURS)
    IssueTimeTracking.editEstimation(true, true);
    // Edit spent time
    IssueTimeTracking.editLogTime(
      true,
      IssueTimeTracking.randomTimeLoggedChanged,
      IssueTimeTracking.timeSpentInputInModal,
      "logged"
    );
    // Edit remaining time
    IssueTimeTracking.editLogTime(
      true,
      IssueTimeTracking.randomRemainingChanged,
      IssueTimeTracking.timeRemainingInputInModal,
      "remaining"
    );
    // Delete ORIGINAL ESTIMATE (HOURS)
    IssueTimeTracking.deleteEstimateTime();

    // Delete spent time
    IssueTimeTracking.deleteLogTime(
      IssueTimeTracking.randomTimeLoggedChanged,
      IssueTimeTracking.timeSpentInputInModal
    );

    // Validate that Logged time is deleted
    IssueTimeTracking.timeAssertion(
      false,
      true,
      false,
      IssueTimeTracking.randomTimeLoggedChanged,
      "logged"
    );

    // Delete remaining time
    IssueTimeTracking.deleteLogTime(
      IssueTimeTracking.randomRemainingChanged,
      IssueTimeTracking.timeRemainingInputInModal
    );

    // Validate that all times are deleted
    IssueTimeTracking.validateEmptyTimeFields();
  });
});
