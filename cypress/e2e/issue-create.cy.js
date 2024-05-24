/* *IMPORTANT*

  Sometimes in order to run this script successfully, 
  it is necessary to run it multiple times! :(

*/
import { faker } from "@faker-js/faker";

function fillIssueFormAndAssert(
  description,
  title,
  issueType,
  reporter,
  assignee,
  priority
) {
  // Description field
  cy.get(".ql-editor").type(description).should("have.text", description);

  // Title
  // Order of filling in the fields is first description, then title on purpose
  // Otherwise filling title first sometimes doesn't work due to web page implementation
  cy.get('input[name="title"]').type(title).should("have.value", title);

  // Issue Type
  cy.get('[data-testid="select:type"]')
    .click()
    .then(() => {
      cy.get('[data-testid="select:type"]').then(($element) => {
        if ($element.text() == issueType) {
          cy.get("label").contains("Issue Type").click();
        } else {
          cy.get('[data-testid="select-option:' + issueType + '"]').click();
        }
      });
    });
  cy.get('[data-testid="select:type"] div').should("contain", issueType);

  // Reporter
  cy.get('[data-testid="select:reporterId"]')
    .click()
    .then(() => {
      cy.get('[data-testid="select:reporterId"]').then(($element) => {
        if ($element.text() == reporter) {
          cy.get("label").contains("Reporter").click();
        } else {
          cy.get('[data-testid="select-option:' + reporter + '"]').click();
        }
      });
    });
  cy.get('[data-testid="select:reporterId"] div').should("contain", reporter);

  // Assignee
  cy.get('[data-testid="form-field:userIds"]')
    .click()
    .then(() => {
      if (assignee == "") {
        cy.get("label").contains("Assignees").click();
      } else {
        cy.get('[data-testid="select-option:' + assignee + '"]').click();
      }
    });

  if (assignee !== "") {
    cy.get('[data-testid="form-field:userIds"]').should("contain", assignee);
  }

  // Priority
  cy.get('[data-testid="select:priority"]')
    .click()
    .then(() => {
      cy.get('[data-testid="select:priority"]').then(($element) => {
        if ($element.text() == priority) {
          cy.get("label").contains("Priority").click();
        } else {
          cy.get('[data-testid="select-option:' + priority + '"]').click();
        }
      });
    });
  cy.get('[data-testid="select:priority"] div').should("contain", priority);
}

function validateCreatedIssueDisplayed(
  description,
  title,
  issueType,
  reporter,
  assignee,
  priority
) {
  cy.get('[data-testid="modal:issue-details"]').should("be.visible");

  // Validate title
  cy.get('[placeholder="Short summary"]').should("have.text", title);

  // Validate description
  cy.get(".ql-snow > div > p").should("have.text", description);

  // Validate status is "Backlog"
  cy.get('[data-testid="select:status"] > div > div').should(
    "have.text",
    "Backlog"
  );

  // Validate issue type icon is visible
  cy.get('[data-testid="icon:' + issueType.toLowerCase() + '"]').should(
    "be.visible"
  );

  // Validate reporter avatar and name
  cy.get('[data-testid="avatar:' + reporter + '"]').should("be.visible");
  cy.get('[data-testid="avatar:' + reporter + '"]')
    .siblings("div")
    .should("contain", reporter);

  // Validate assignee or unassigned status
  if (assignee !== "") {
    // data-testid="select:assignees"
    cy.get('[data-testid="avatar:' + assignee + '"]').should("be.visible");
    cy.get('[data-testid="avatar:' + assignee + '"]')
      .siblings("div")
      .should("contain", assignee);
  } else {
    cy.get('[data-testid="select:assignees"] > div').should(
      "have.text",
      "Unassigned"
    );
  }
  // Validate priority
  cy.get('[data-testid="select:priority"]').within(() => {
    cy.contains("div", priority).should("have.text", priority);
  });

  // Validate creation time
  const creationTimeClassName = ".sc-krDsej.hZoggr";
  cy.get(creationTimeClassName).should(
    "contain",
    "Created at a few seconds ago"
  );
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
      fillIssueFormAndAssert(
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
  it("Should create another issue and validate it successfully", () => {
    const description = "My bug description";
    const title = "Bug";
    const issueType = "Bug";
    const reporter = "Pickle Rick";
    const assignee = "Lord Gaben";
    const priority = "Highest";

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillIssueFormAndAssert(
        description,
        title,
        issueType,
        reporter,
        assignee,
        priority
      );
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Assert that the first issue has same title, open it and verify it is made few sec ago
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

    validateCreatedIssueDisplayed(
      description,
      title,
      issueType,
      reporter,
      assignee,
      priority
    );
  });

  // Assignment 2/ Test case 2
  it("Should create an issue with random data", () => {
    const randomDescription = faker.lorem.sentence();
    const randomTitle = faker.word.noun();
    const issueType = "Task";
    const reporter = "Baby Yoda";
    const assignee = ""; // empty value
    const priority = "Low";

    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      fillIssueFormAndAssert(
        randomDescription,
        randomTitle,
        issueType,
        reporter,
        assignee,
        priority
      );
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Assert that the first issue has same title, open it and verify it is made few sec ago
    cy.get('[data-testid="list-issue"]')
      .first()
      .find("p")
      .contains(randomTitle)
      .siblings()
      .within(() => {
        const avatarClass = ".sc-dnqmqq.jqCWTw.sc-eXEjpC.iLqImh";
        cy.get(avatarClass).should("not.exist");
        cy.get('[data-testid="icon:' + issueType.toLowerCase() + '"]').should(
          "be.visible"
        );
      })
      .click();

    validateCreatedIssueDisplayed(
      randomDescription,
      randomTitle,
      issueType,
      reporter,
      assignee,
      priority
    );
  });
});
