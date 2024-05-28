// Variables
const issueTitle = "This is an issue of type: Task.";
const confirmTitle = "Are you sure you want to delete this issue?";
const confirmMessage = "Once you delete, it's gone for good.";
const confirmWindow = '[data-testid="modal:confirm"]';
const trashButton = '[data-testid="icon:trash"]';
const deleteButtonTextInConfirm = "Delete issue";
const deleteButtonInConfirm = ".sc-bwzfXH.dIxFno.sc-kGXeez.bLOzZQ";
const cancelButtonInConfirm = ".sc-bwzfXH.ewzfNn.sc-kGXeez.bLOzZQ";
const cancelButtonTextInConfirm = "Cancel";
const closeIssueDetailViewButton = ".sc-bdVaJa.fuyACr";

// Functions
function assertConfirmationModal(title, message) {
  cy.get(confirmWindow)
    .should("be.visible")
    .and("contain", title)
    .and("contain", message);
}

function clickButtonInConfirm(button, buttonText) {
  cy.get(button).should("contain", buttonText).click();
}

function IssueVisibilityOnBoard(issueTitle, trueOrFalse) {
  cy.get('[data-testid="list-issue"]').should("be.visible");
  cy.reload();

  if (trueOrFalse) {
    cy.contains(issueTitle).should("be.visible");
  } else {
    cy.contains(issueTitle).should("not.exist");
  }
}

describe("Issue deletion", () => {
  beforeEach(() => {
    cy.visit("/project/board").then(() => {
      cy.url().should("eq", `${Cypress.env("baseUrl")}project/board`);
      cy.contains(issueTitle).click();
      cy.get('[data-testid="modal:issue-details"]').should("be.visible");
      cy.get('[placeholder="Short summary"]').should("have.text", issueTitle);
    });
  });

  // ASSIGNMENT 3: Test Case 1: Issue Deletion
  it("Should delete an issue and validate it successfully", () => {
    cy.get(trashButton).click();
    assertConfirmationModal(confirmTitle, confirmMessage);
    clickButtonInConfirm(deleteButtonInConfirm, deleteButtonTextInConfirm);
    cy.get(confirmWindow).should("not.exist");
    IssueVisibilityOnBoard(issueTitle, false);
  });

  // ASSIGNMENT 3: Test Case 2: Issue Deletion Cancellation
  it("Initiating the issue deletion process and then canceling it", () => {
    cy.get(trashButton).click();
    assertConfirmationModal(confirmTitle, confirmMessage);
    clickButtonInConfirm(cancelButtonInConfirm, cancelButtonTextInConfirm);
    cy.get(confirmWindow).should("not.exist");
    cy.get(closeIssueDetailViewButton).click();
    IssueVisibilityOnBoard(issueTitle, true);
  });
});
