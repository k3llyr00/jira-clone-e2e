import { faker } from "@faker-js/faker";

class IssueComment {
  constructor() {
    this.issueTitle = "This is an issue of type: Task.";
    this.originalComment = faker.lorem.sentence();
    this.issueDetailModalSelector = '[data-testid="modal:issue-details"]';
    this.commentAreaSelector2 = 'textarea[placeholder="Add a comment..."]';
    this.commentAreaSelector = "Add a comment...";
    this.saveButtonSelector = "button:contains('Save')";
    this.issueCommentsSelector = '[data-testid="issue-comment"]';
    this.EditBtn = "Edit";
    this.changedComment = faker.lorem.sentence();
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

  addNewComment() {
    this.getIssueDetailModal().within(() => {
      this.getCommentArea().click();
      this.getCommentArea2().type(this.originalComment);
      this.getSaveButton().click().should("not.exist");
      this.getCommentArea().should("exist");
      this.getIssueComments().should("contain", this.originalComment);
    });
  }

  editComment() {
    this.getIssueDetailModal().within(() => {
      this.getIssueComments()
        .first()
        .contains(this.EditBtn)
        .click()
        .should("not.exist");
      this.getCommentArea2()
        .should("contain", this.originalComment)
        .clear()
        .type(this.changedComment);
      this.getSaveButton().click().should("not.exist");
      this.getCommentArea().should("exist");
      this.getIssueComments().should("contain", this.changedComment);
    });
  }

  getConfrimModal() {
    return cy.get(this.confirmModalWindow);
  }

  deleteComment() {
    this.getIssueDetailModal()
      .find(this.issueCommentsSelector)
      .contains(this.deleteBtn)
      .click();
    this.getConfrimModal()
      .find(this.confirmDeleteBtn)
      .click()
      .should("not.exist");

    this.getIssueDetailModal().should("not.contain", this.changedComment);
  }
}

export default new IssueComment();
