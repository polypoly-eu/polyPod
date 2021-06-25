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

    it(`should throw an error if the "How to read this" content has change`, () => {
        cy.get(".help").click();
        cy.get("button").click();
    });
});
