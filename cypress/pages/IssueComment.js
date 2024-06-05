import { faker } from "@faker-js/faker";

class IssueComment {
  constructor() {
    this.issueTitle = "This is an issue of type: Task.";
    this.changedComment = faker.lorem.sentence();
    this.originalComment = faker.lorem.sentence();
    this.timeout = { timeout: 60000 };

    // Selectors
    this.listIssue = '[data-testid="list-issue"]';
    this.issueDetailModalSelector = '[data-testid="modal:issue-details"]';
    this.commentAreaSelector2 = 'textarea[placeholder="Add a comment..."]';
    this.commentAreaSelector = "Add a comment...";
    this.saveButtonSelector = "button:contains('Save')";
    this.issueCommentsSelector = '[data-testid="issue-comment"]';
    this.editBtn = "Edit";
    this.deleteBtn = "Delete";
    this.confirmModalWindow = '[data-testid="modal:confirm"]';
    this.confirmDeleteBtn = "button:contains('Delete comment')";
  }

  getIssueDetailModal() {
    return cy.get(this.issueDetailModalSelector);
  }

  getCommentArea() {
    return cy.contains(this.commentAreaSelector);
  }

  getCommentArea2() {
    return cy.get(this.commentAreaSelector2);
  }

  getSaveButton() {
    return cy.get(this.saveButtonSelector);
  }

  getIssueComments() {
    return cy.get(this.issueCommentsSelector);
  }

  getConfirmModal() {
    return cy.get(this.confirmModalWindow);
  }

  addNewComment() {
    this.getIssueDetailModal().within(() => {
      this.getCommentArea().click();
      this.getCommentArea2().type(this.originalComment);
      this.getSaveButton().click().should("not.exist");
      this.getCommentArea().should("exist");
      this.getIssueComments()
        .should("have.length", "2")
        .first("contain", this.originalComment);
    });
  }

  editComment() {
    this.getIssueDetailModal().within(() => {
      this.getIssueComments()
        .first()
        .contains(this.editBtn)
        .click()
        .should("not.exist");
      this.getCommentArea2()
        .should("contain", this.originalComment)
        .clear()
        .type(this.changedComment);
      this.getSaveButton().click().should("not.exist");
      this.getCommentArea().should("exist");
      this.getIssueComments()
        .should("have.length", "2")
        .first("contain", this.changedComment);
    });
  }

  deleteComment() {
    this.getIssueDetailModal()
      .find(this.issueCommentsSelector)
      .contains(this.deleteBtn)
      .click();
    this.getConfirmModal()
      .find(this.confirmDeleteBtn)
      .click()
      .should("not.exist");
    this.getIssueComments().should("have.length", "1");
    this.getIssueDetailModal().should("not.contain", this.changedComment);
  }
}

export default new IssueComment();
