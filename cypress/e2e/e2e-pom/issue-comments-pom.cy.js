import IssueComment from "../../pages/IssueComment.js";

describe("Issue comments creating, editing and deleting with POM approach", () => {
  beforeEach(() => {
    cy.visit("/");

    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");

        // Wait for a key element to be visible to ensure the page is fully loaded
        cy.get(IssueComment.listIssue, IssueComment.timeout).should(
          "be.visible"
        );

        // Ensure the issue title is present before clicking
        cy.get(IssueComment.issueTitle, IssueComment.timeout)
          .should("be.visible")
          .click();
      });
  });

  it("Add, edit and delete issue comments", () => {
    IssueComment.addNewComment();
    IssueComment.editComment();
    IssueComment.deleteComment();
  });
});
