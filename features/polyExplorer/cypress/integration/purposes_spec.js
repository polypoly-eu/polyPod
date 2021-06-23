const INDEX_ROUTE = "dist/index.html";

describe("Purposes", () => {
    beforeEach(() => {
        cy.visit(INDEX_ROUTE);
        cy.get(".button-container button")
            .click()
            .then(() => {
                return cy
                    .get(
                        ".swiper-slide.swiper-slide-active .data-sharing-section.purposes-shared .data-sharing-gauge"
                    )
                    .click();
            });
    });

    it(`should throw an error if the graph of data purpose has change`, () => {
        cy.matchImageSnapshot("purposes0");
    });

    it(`should throw an error if the "How to read this" content has change`, () => {
        cy.get(".help").click();
        cy.matchImageSnapshot("purposesinfo0");
        cy.get("button").click();
        cy.matchImageSnapshot("purposes0");
    });
});
