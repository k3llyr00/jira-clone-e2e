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
    this.randomOriginalEstimateHours = faker.number.int({ min: 1, max: 100 });
    this.randomTimeLogged = faker.number.int({ min: 1, max: 100 });
    this.randomRemaining = faker.number.int({ min: 1, max: 100 });
    this.processBarValue;
    this.estimatedTitleTimeTrackerModal = "Time spent (hours)";

    this.listIssue = '[data-testid="list-issue"]';
    this.issueDetailModalSelector = '[data-testid="modal:issue-details"]';
    this.estimatedInputField = 'input[placeholder="Number"]';
    this.stopwatchIcon = '[data-testid="icon:stopwatch"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.timeSpentInputInModal = 0;
    this.timeRemainingInputInModal = 1;
    this.doneButtonTimeTracker = "Done";
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

  getIssueDetailModal() {
    return cy.get(this.issueDetailModalSelector);
  }

  getEstimatedField() {
    return cy.get(this.estimatedInputField);
  }

  getStopwatchIcon() {
    return cy.get(this.stopwatchIcon);
  }

  getProgressBar(expectedWidth) {
    return cy
      .get(this.stopwatchIcon)
      .parent()
      .find(`[width*="${expectedWidth}"]`);
  }

  getTimeTrackingModal() {
    return cy.get(this.timeTrackingModal);
  }

  getTimeTrackingInputFieldInModal(field) {
    return cy.get(this.estimatedInputField).eq(field);
  }

  getDoneButtonTimeTrackingModal() {
    return cy.contains(this.doneButtonTimeTracker);
  }

  createIssue(description, title) {
    this.getCreateIssueBtn().click();
    this.getIssueDescription()
      .type(description)
      .should("have.text", description);
    this.getIssueTitleField().type(title).should("have.value", title);
    this.getIssueSubmitBtn().click();
  }

  calculateExpectedProcessBar(
    isEstimatedOverwritten,
    estimatedHours,
    timeLogged
  ) {
    if (isEstimatedOverwritten === false) {
      if ((estimatedHours && !timeLogged) || (!estimatedHours && !timeLogged)) {
        this.processBarValue = 0;
      } else {
        if (this.randomTimeLogged > this.randomOriginalEstimateHours) {
          this.processBarValue = 100;
        } else {
          this.processBarValue = Math.max(
            1,
            Math.round(
              (this.randomTimeLogged / this.randomOriginalEstimateHours) * 100
            )
          );
        }
      }
    } else {
      this.processBarValue = Math.max(
        1,
        Math.round(
          (this.randomTimeLogged /
            (this.randomTimeLogged + this.randomRemaining)) *
            100
        )
      );
    }
    return this.processBarValue;
  }

  validateEmptyTimeFields() {
    this.getIssueDetailModal().within(() => {
      this.getEstimatedField()
        .should("have.value", "")
        .and("have.attr", "placeholder", "Number");
      this.timeAssertion(false);
      this.getProgressBar(
        this.calculateExpectedProcessBar(false, false, false)
      );
    });
  }

  addNewEstimation() {
    this.getIssueDetailModal().within(() => {
      this.getEstimatedField().click().type(this.randomOriginalEstimateHours);
      this.timeAssertion(true, this.randomOriginalEstimateHours, "estimated");
      this.getProgressBar(this.calculateExpectedProcessBar(false, true, false));
    });
  }

  logTime(time, inputFieldIndex, type) {
    this.getIssueDetailModal().within(() => {
      this.getStopwatchIcon().click();
    });
    this.getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        this.getTimeTrackingInputFieldInModal(inputFieldIndex).type(time);
        this.getDoneButtonTimeTrackingModal().click();
      });
    this.getTimeTrackingModal().should("not.exist");
    this.timeAssertion(true, time, type);
    console.log(
      "Remaining should activate the if-clause",
      time == this.randomRemaining,
      time,
      this.randomRemaining
    );
    if (time == this.randomRemaining) {
      this.getProgressBar(this.calculateExpectedProcessBar(true, true, true));
    } else {
      this.getProgressBar(this.calculateExpectedProcessBar(false, true, true));
    }
  }

  timeAssertion(notEmpty, value, type) {
    if (notEmpty) {
      this.getStopwatchIcon()
        .next()
        .children()
        .should("contain", `${value}h ${type}`);
    } else {
      this.getStopwatchIcon()
        .next()
        .children()
        .should("contain", "No time logged");
    }
  }
}

export default new IssueTimeTracking();
