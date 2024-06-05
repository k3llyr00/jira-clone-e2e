import { faker } from "@faker-js/faker";

class IssueTimeTracking {
  constructor() {
    // Creating Issue
    this.randomDescription = faker.lorem.sentence();
    this.randomTitle = faker.word.noun();

    this.createIssueBtn = '[data-testid="icon:plus"]';
    this.issueDescription = ".ql-editor";
    this.issueTitleField = 'input[name="title"]';
    this.issueSubmit = 'button[type="submit"]';

    // Time tracker
    this.issueTitle = this.randomTitle;
    this.timeout = { timeout: 60000 };
    this.originalEstimateHours = 10;

    this.listIssue = '[data-testid="list-issue"]';
    this.issueDetailModalSelector = '[data-testid="modal:issue-details"]';
    this.originalEstimateInputField = 'input[placeholder="Number"]';
    this.stopwatchIcon = '[data-testid="icon:stopwatch"]';
    this.timeTrackingLabel = "Time Tracking";
  }

  getCreateIssueBtn() {
    return cy.get(this.createIssueBtn);
  }

  getIssueDescription() {
    return cy.get(this.issueDescription);
  }

  getIssueTitleField() {
    return cy.get(this.issueTitleField);
  }

  getIssueSubmitBtn() {
    return cy.get(this.issueSubmit);
  }

  createIssue(description, title) {
    this.getCreateIssueBtn().click();
    this.getIssueDescription()
      .type(description)
      .should("have.text", description);
    this.getIssueTitleField().type(title).should("have.value", title);
    this.getIssueSubmitBtn().click();
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModalSelector);
  }

  getOriginalEstimate() {
    return cy.get(this.originalEstimateInputField);
  }

  getStopwatchIcon() {
    return cy.get(this.stopwatchIcon);
  }

  getTimeBar() {
    return cy.get('[width="0"]');
  }

  validateEmptyEstimation() {
    this.getIssueDetailModal().within(() => {
      this.getOriginalEstimate()
        .should("have.value", "")
        .and("have.attr", "placeholder", "Number");
      this.getStopwatchIcon()
        .next()
        .children()
        .should("contain", "No time logged");
      this.getTimeBar().should("exist");
    });
  }

  addNewEstimation() {
    this.getIssueDetailModal().within(() => {
      this.getOriginalEstimate().click().type(this.originalEstimateHours);
      this.getStopwatchIcon()
        .next()
        .children()
        .should("contain", `${this.originalEstimateHours}h estimated`);
    });
  }
}

export default new IssueTimeTracking();
