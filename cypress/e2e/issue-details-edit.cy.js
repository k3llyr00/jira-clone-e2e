describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should update type, status, assignees, reporter, priority successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:type"]').click("bottomRight");
      cy.get('[data-testid="select-option:Story"]')
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="select:type"]').should("contain", "Story");

      cy.get('[data-testid="select:status"]').click("bottomRight");
      cy.get('[data-testid="select-option:Done"]').click();
      cy.get('[data-testid="select:status"]').should("have.text", "Done");

      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('[data-testid="select:assignees"]').click("bottomRight");
      cy.get('[data-testid="select-option:Baby Yoda"]').click();
      cy.get('[data-testid="select:assignees"]').should("contain", "Baby Yoda");
      cy.get('[data-testid="select:assignees"]').should(
        "contain",
        "Lord Gaben"
      );

      cy.get('[data-testid="select:reporter"]').click("bottomRight");
      cy.get('[data-testid="select-option:Pickle Rick"]').click();
      cy.get('[data-testid="select:reporter"]').should(
        "have.text",
        "Pickle Rick"
      );

      cy.get('[data-testid="select:priority"]').click("bottomRight");
      cy.get('[data-testid="select-option:Medium"]').click();
      cy.get('[data-testid="select:priority"]').should("have.text", "Medium");
    });
  });

  it("Should update title, description successfully", () => {
    const title = "TEST_TITLE";
    const description = "TEST_DESCRIPTION";

    getIssueDetailsModal().within(() => {
      cy.get('textarea[placeholder="Short summary"]')
        .clear()
        .type(title)
        .blur();

      cy.get(".ql-snow").click().should("not.exist");

      cy.get(".ql-editor").clear().type(description);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get('textarea[placeholder="Short summary"]').should(
        "have.text",
        title
      );
      cy.get(".ql-snow").should("have.text", description);
    });
  });

  it.only("Validate the Priority dropdown on the issue detail page", () => {
    // Variables
    const expectedLength = 5;
    let arrayOfPriorities = [];

    // Selectors
    const priorityDropdownElement = '[data-testid="icon:arrow-up"]';
    const listOfPrioritiesElement = "[data-select-option-value]";

    // Click the priority dropdown
    cy.get(priorityDropdownElement).next().click();

    // Get the text of the default priority, push it into array and assert it
    cy.get(priorityDropdownElement)
      .next()
      .invoke("text")
      .then((text) => {
        arrayOfPriorities.push(text);
        expect(arrayOfPriorities).to.contain(text);
      });

    // Loop through the options, push priorities into array and get their text
    cy.get(listOfPrioritiesElement).each(($priority) => {
      cy.wrap($priority)
        .invoke("text")
        .then((text) => {
          arrayOfPriorities.push(text);
          expect(arrayOfPriorities).to.contain(text);
          cy.log(arrayOfPriorities.length);
        });
    });

    // Assert the length of the array after all options are added
    cy.wrap(arrayOfPriorities).its("length").should("eq", expectedLength);
  });
});
