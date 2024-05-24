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
function clickTrashButtonInIssueDetail(title, message) {
  cy.get('[data-testid="icon:trash"]').click();
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
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();

        // Assert the visibility of the issue detail view modal
        cy.get('[data-testid="modal:issue-details"]').should("be.visible");
        // Assert that correct  issue is opened.
        cy.get('[placeholder="Short summary"]').should("have.text", issueTitle);
      });
  });

  // ASSIGNMENT 3: Test Case 1: Issue Deletion
  it("Should delete an issue and validate it successfully", () => {
    // Delete the issue by clicking the delete button and confirming the deletion.
    clickTrashButtonInIssueDetail(confirmTitle, confirmMessage);
    clickButtonInConfirm(deleteButtonInConfirm, deleteButtonTextInConfirm);

    // Assert that the deletion confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    // Assert that the issue is deleted and no longer displayed on the Jira board.
    cy.get('[data-testid="list-issue"]').should("not.contain", issueTitle);
  });

  // ASSIGNMENT 3: Test Case 2: Issue Deletion Cancellation
  it("Initiating the issue deletion process and then canceling it", () => {
    clickTrashButtonInIssueDetail(confirmTitle, confirmMessage);
    clickButtonInConfirm(cancelButtonInConfirm, cancelButtonTextInConfirm);

    // Assert that the deletion confirmation dialogue is not visible.
    cy.get('[data-testid="modal:confirm"]').should("not.exist");
    // Assert that the issue is not deleted and displayed on the Jira board.
    cy.get(closeIssueDetailViewButton).click();
    cy.get('[data-testid="list-issue"]').should("contain", issueTitle);
  });
});
