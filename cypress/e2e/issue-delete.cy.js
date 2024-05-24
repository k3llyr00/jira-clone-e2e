// Variables
const issueTitle = "This is an issue of type: Task.";
const confirmTitle = "Are you sure you want to delete this issue?";
const confirmMessage = "Once you delete, it's gone for good.";
const deleteButtonTextInConfirm = "Delete issue";
const deleteButtonInConfirm = ".sc-bwzfXH.dIxFno.sc-kGXeez.bLOzZQ";
const cancelButtonInConfirm = ".sc-bwzfXH.ewzfNn.sc-kGXeez.bLOzZQ";
const cancelButtonTextInConfirm = "Cancel";
const closeIssueDetailViewButton = ".sc-bdVaJa.fuyACr";

// Functions
function assertConfirmationModal(title, message) {
  cy.get('[data-testid="modal:confirm"]')
    .should("be.visible")
    .and("contain", title)
    .and("contain", message);
}

function clickButtonInConfirm(button, buttonText) {
  cy.get(button).should("contain", buttonText).click();
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
    cy.get('[data-testid="icon:trash"]').click();
    assertConfirmationModal(confirmTitle, confirmMessage);
    clickButtonInConfirm(deleteButtonInConfirm, deleteButtonTextInConfirm);
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get('[data-testid="list-issue"]').should("not.contain", issueTitle);
  });

  // ASSIGNMENT 3: Test Case 2: Issue Deletion Cancellation
  it("Initiating the issue deletion process and then canceling it", () => {
    cy.get('[data-testid="icon:trash"]').click();
    assertConfirmationModal(confirmTitle, confirmMessage);
    clickButtonInConfirm(cancelButtonInConfirm, cancelButtonTextInConfirm);
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    cy.get(closeIssueDetailViewButton).click();
    cy.get('[data-testid="list-issue"]').should("contain", issueTitle);
  });
});
