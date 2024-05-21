import { faker } from "@faker-js/faker";

function fillIssueForm(
  description,
  title,
  issueType,
  reporter,
  assignee,
  priority
) {
  // Type value to description input field
  cy.get(".ql-editor").type(description);
  cy.get(".ql-editor").should("have.text", description);

  // Type value to title input field
  // Order of filling in the fields is first description, then title on purpose
  // Otherwise filling title first sometimes doesn't work due to web page implementation
  cy.get('input[name="title"]').type(title);
  cy.get('input[name="title"]').should("have.value", title);

  // Issue type
  cy.get('[data-testid="select:type"]').click();
  cy.get('[data-testid="select-option:' + issueType + '"]')
    .wait(1000)
    .trigger("mouseover")
    .trigger("click");
  cy.get('[data-testid="icon:' + issueType.toLowerCase() + '"]').should(
    "be.visible"
  );

  // Reporter
  cy.get('[data-testid="select:reporterId"]')
    .click()
    .then(() => {
      cy.get('[tabindex="0"]')
        .contains(reporter)
        .then(($element) => {
          if ($element == reporter) {
            cy.get("label").contains("Reporter").click();
          } else {
            cy.get('[data-testid="select-option:' + reporter + '"]').click();
          }
        });
    });

  // Assignee
  cy.get('[data-testid="form-field:userIds"]').click();
  cy.get('[data-testid="select-option:' + assignee + '"]').click();

  // Priority
  cy.get('[data-testid="select:priority"]')
    .click()
    .then(() => {
      cy.get('[tabindex="0"]')
        .contains(priority)
        .then(($element) => {
          if ($element == priority) {
            cy.get("label").contains("Priority").click();
          } else {
            cy.get('[data-testid="select-option:' + priority + '"]').click();
          }
        });
    });
}

describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    const description = "TEST_DESCRIPTION";
    const title = "TEST_TITLE";
    const issueType = "Story";
    const reporter = "Baby Yoda";
    const assignee = "Pickle Rick";
    const priority = "Medium";

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillIssueForm(
        description,
        title,
        issueType,
        reporter,
        assignee,
        priority
      );
      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", "1")
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", "5")
          .first()
          .find("p")
          .contains(title)
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:' + assignee + '"]').should(
              "be.visible"
            );
            cy.get(
              '[data-testid="icon:' + issueType.toLowerCase() + '"]'
            ).should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains(title)
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:' + assignee + '"]').should("be.visible");
        cy.get('[data-testid="icon:' + issueType.toLowerCase() + '"]').should(
          "be.visible"
        );
      });
  });

  it("Should validate title if required field is missing", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Try to click create issue button without filling any data
      cy.get('button[type="submit"]').click();

      // Assert that correct error message is visible
      cy.get('[data-testid="form-field:title"]').should(
        "contain",
        "This field is required"
      );
    });
  });

  // Assignment 2/ Test case 1
  it.only("Should create another issue and validate it successfully", () => {
    const description = "My bug description";
    const title = "Bug";
    const issueType = "Bug";
    const reporter = "Pickle Rick";
    const assignee = "Lord Gaben";
    const priority = "Highest";
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillIssueForm(
        description,
        title,
        issueType,
        reporter,
        assignee,
        priority
      );
      cy.get('button[type="submit"]').click();
    });

    // Assert that the issue has been created and is visible on the board.

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Assert that in backlog there is new issue with same title, open it and verify it is made few sec ago
    cy.get('[data-testid="list-issue"]')
      .first()
      .find("p")
      .contains(title)
      .siblings()
      .within(() => {
        cy.get('[data-testid="avatar:' + assignee + '"]').should("be.visible");
        cy.get('[data-testid="icon:' + issueType.toLowerCase() + '"]').should(
          "be.visible"
        );
      })
      .click();

    const createdTimeClassName = ".sc-krDsej.hZoggr";
    cy.get(createdTimeClassName).should(
      "contain",
      "Created at a few seconds ago"
    );
  });

  // Assignment 2/ Test case 2
  it("Should create an issue with random data", () => {});
});
