import IssueComment from "../../pages/IssueComment.js";

describe("Issue comments creating, editing and deleting with POM approach", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(IssueComment.issueTitle).click();
      });
  });

  it("Add, edit and delete issue comments", () => {
    IssueComment.addNewComment();
    IssueComment.editComment();
    IssueComment.deleteComment();
  });
});
