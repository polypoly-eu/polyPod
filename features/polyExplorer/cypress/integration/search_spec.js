const INDEX_ROUTE = "dist/index.html";

describe("Search", () => {
    beforeEach(() => {
        cy.visit(INDEX_ROUTE);
        cy.get(".button-container button")
            .click()
            .then(() => {
                cy.get(
                    ".swiper-slide-active > .scrolling-area > .featured-company-card"
                ).trigger("keyup", { key: "s" });
            });
    });

    it(`should be able to clear the content of the input clicking on the clear button`, () => {
        cy.get(".search-bar-input")
            .type("Amazon")
            .then(() => {
                return cy.get(".clr.active").click();
            });
    });

    it(`should be able to arrive at the data graph through the search`, () => {
        cy.get(".suggestions > :nth-child(1)")
            .click()
            .then(() => {
                return cy.get(".tab-button-container > :nth-child(2)").click();
            })
            .then(() => {
                return cy.get(".explore-data-btn").click();
            });
    });
});
