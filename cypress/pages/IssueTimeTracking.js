import { faker } from "@faker-js/faker";

class IssueTimeTracking {
  constructor() {
    // Creating Issue
    this.randomDescription = faker.lorem.sentence();
    this.randomTitle = faker.lorem.words(3);

    this.createIssueBtn = '[data-testid="icon:plus"]';
    this.issueDescription = ".ql-editor";
    this.issueTitleField = 'input[name="title"]';
    this.issueSubmit = 'button[type="submit"]';

    // Time tracker
    this.issueTitle = this.randomTitle;
    this.timeout = { timeout: 60000 };
    this.randomOriginalEstimateHours = faker.number.int({ min: 1, max: 100 });
    this.randomEstimateHoursChanged = faker.number.int({ min: 1, max: 100 });
    this.randomTimeLogged = faker.number.int({ min: 1, max: 100 });
    this.randomTimeLoggedChanged = faker.number.int({ min: 1, max: 100 });
    this.randomRemaining = faker.number.int({ min: 1, max: 100 });
    this.randomRemainingChanged = faker.number.int({ min: 1, max: 100 });
    this.processBarValue;

    this.listIssue = '[data-testid="list-issue"]';
    this.issueDetailModalSelector = '[data-testid="modal:issue-details"]';
    this.estimatedInputField = 'input[placeholder="Number"]';
    this.stopwatchIcon = '[data-testid="icon:stopwatch"]';
    this.timeTrackingModal = '[data-testid="modal:tracking"]';
    this.timeSpentInputInModal = 0;
    this.timeRemainingInputInModal = 1;
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

  getProgressBarWidth() {
    return cy
      .get(this.stopwatchIcon)
      .parent()
      .find("[width]")
      .invoke("attr", "width")
      .then((width) => Math.round(Number(width)));
  }

  verifyProgressBarWidth(expectedWidth) {
    this.getProgressBarWidth().then((capturedWidth) => {
      expect(capturedWidth).to.equal(expectedWidth);
    });
  }

  getTimeTrackingModal() {
    return cy.get(this.timeTrackingModal);
  }

  getTimeTrackingInputFieldInModal(field) {
    return cy.get(this.estimatedInputField).eq(field);
  }

  getDoneButtonTimeTrackingModal() {
    return cy.contains("Done");
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
    timeLogged,
    randomEstimated,
    randomLogged,
    randomRemaining
  ) {
    if (!isEstimatedOverwritten) {
      if ((estimatedHours && !timeLogged) || (!estimatedHours && !timeLogged)) {
        this.processBarValue = 0;
      } else if (randomLogged > randomEstimated) {
        this.processBarValue = 100;
      } else {
        this.processBarValue = Math.max(
          1,
          Math.round((randomLogged / randomEstimated) * 100)
        );
      }
    } else {
      this.processBarValue = Math.max(
        1,
        Math.round((randomLogged / (randomLogged + randomRemaining)) * 100)
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

      const expectedWidth = this.calculateExpectedProcessBar(
        false,
        false,
        false,
        this.randomOriginalEstimateHours,
        this.randomTimeLogged,
        this.randomRemaining
      );
      this.verifyProgressBarWidth(expectedWidth);
    });
  }

  addNewEstimation(isEstimatedOverwritten) {
    this.getIssueDetailModal().within(() => {
      this.getEstimatedField().click().type(this.randomOriginalEstimateHours);
      this.timeAssertion(false, isEstimatedOverwritten, false, true, false);

      const expectedWidth = this.calculateExpectedProcessBar(
        false,
        true,
        false,
        this.randomOriginalEstimateHours,
        this.randomTimeLogged,
        this.randomRemaining
      );
      this.verifyProgressBarWidth(expectedWidth);
    });
  }

  editEstimation(timeValuesNotEmpty, isEstimatedOverwritten) {
    this.getIssueDetailModal().within(() => {
      this.getEstimatedField()
        .click()
        .clear()
        .type(this.randomEstimateHoursChanged);
      this.getEstimatedField().should(
        "not.equal",
        this.randomOriginalEstimateHours
      );
      this.timeAssertion(
        timeValuesNotEmpty,
        isEstimatedOverwritten,
        true,
        this.randomEstimateHoursChanged,
        "remaining"
      );

      const expectedWidth = this.calculateExpectedProcessBar(
        true,
        true,
        true,
        this.randomEstimateHoursChanged,
        this.randomTimeLogged,
        this.randomRemaining
      );
      this.verifyProgressBarWidth(expectedWidth);
    });
  }

  deleteEstimateTime() {
    this.getIssueDetailModal().within(() => {
      this.getEstimatedField()
        .clear()
        .should("have.value", "")
        .and("have.attr", "placeholder", "Number");
      this.getStopwatchIcon().should("not.contain", "estimated");
    });
  }

  logTime(isEstimatedOverwritten, time, inputFieldIndex, type) {
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
    this.timeAssertion(true, isEstimatedOverwritten, false, time, type);

    if (time == this.randomRemaining) {
      const expectedWidth = this.calculateExpectedProcessBar(
        true,
        true,
        true,
        this.randomOriginalEstimateHours,
        this.randomTimeLogged,
        this.randomRemaining
      );
      this.verifyProgressBarWidth(expectedWidth);
    } else {
      const expectedWidth = this.calculateExpectedProcessBar(
        false,
        true,
        true,
        this.randomOriginalEstimateHours,
        this.randomTimeLogged,
        this.randomRemaining
      );
      this.verifyProgressBarWidth(expectedWidth);
    }
  }

  editLogTime(isEstimatedOverwritten, time, inputFieldIndex, type) {
    this.getIssueDetailModal().within(() => {
      this.getStopwatchIcon().click();
    });
    this.getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        this.getTimeTrackingInputFieldInModal(inputFieldIndex)
          .clear()
          .type(time);
        this.getDoneButtonTimeTrackingModal().click();
      });
    this.getTimeTrackingModal().should("not.exist");
    this.timeAssertion(true, isEstimatedOverwritten, false, time, type);

    if (time == this.randomRemainingChanged) {
      console.log("editTime time equals this.randomRemainingChanged");
      const expectedWidth = this.calculateExpectedProcessBar(
        true,
        true,
        true,
        this.randomEstimateHoursChanged,
        this.randomTimeLoggedChanged,
        this.randomRemainingChanged
      );
      this.verifyProgressBarWidth(expectedWidth);
    } else {
      console.log("editTime time else-clause");
      const expectedWidth = this.calculateExpectedProcessBar(
        true,
        true,
        true,
        this.randomEstimateHoursChanged,
        this.randomTimeLoggedChanged,
        this.randomRemaining
      );
      this.verifyProgressBarWidth(expectedWidth);
    }
  }

  deleteLogTime(time, inputFieldIndex) {
    this.getIssueDetailModal().within(() => {
      this.getStopwatchIcon().click();
    });
    this.getTimeTrackingModal()
      .should("be.visible")
      .within(() => {
        this.getTimeTrackingInputFieldInModal(inputFieldIndex).clear();
        this.getDoneButtonTimeTrackingModal().click();
      });
    this.getTimeTrackingModal().should("not.exist");
  }

  timeAssertion(
    notEmpty,
    isEstimatedOverwritten,
    editEstimationTrue,
    value,
    type
  ) {
    if (notEmpty) {
      if (isEstimatedOverwritten && editEstimationTrue) {
        this.getEstimatedField().should("have.value", value);
      } else {
        this.getStopwatchIcon()
          .next()
          .children()
          .should("contain", `${value}h ${type}`);
      }
    } else {
      this.getStopwatchIcon()
        .next()
        .children()
        .should("contain", "No time logged");
    }
  }
}
export default new IssueTimeTracking();
