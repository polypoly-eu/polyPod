const INDEX_ROUTE = "dist/index.html"

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
        cy.matchImageSnapshot("search0");
        cy.get(".search-bar-input")
            .type("Amazon")
            .then(() => {
                cy.matchImageSnapshot("search1");
                return cy.get(".clr.active").click();
            })
            .then(() => {
                cy.matchImageSnapshot("search0");
            });
    });

    it(`should be able to arrive at the data graph through the search`, () => {
        cy.get(".suggestions > :nth-child(1)")
            .click()
            .then(() => {
                cy.matchImageSnapshot("search2");
                return cy.get(".tab-button-container > :nth-child(2)").click();
            })
            .then(() => {
                cy.matchImageSnapshot("search3");
                return cy.get(".explore-data-btn").click();
            })
            .then(() => {
                cy.matchImageSnapshot("search4");
            });
    });
});
