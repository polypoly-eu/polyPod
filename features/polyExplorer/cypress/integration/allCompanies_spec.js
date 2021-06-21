const INDEX_ROUTE = "dist/index.html"
describe("All companies", () => {
    beforeEach(() => {
        cy.visit(INDEX_ROUTE);
        cy.get(".button-container button")
            .click()
            .then(() => {
                return cy.get(".nav-button-container > :nth-child(2)").click();
            });
    });

    it(`should arrive at the list of all companies`, () => {
        cy.matchImageSnapshot("allCompanies0");
        cy.get(":nth-child(1) > .company-group-companies > :nth-child(1)")
            .click()
            .then(() => {
                cy.matchImageSnapshot("allCompanies1");
            });
    });

    it(`should show the companies which match with the filters`, () => {
        cy.get(".filter-button")
            .click()
            .then(() => {
                cy.matchImageSnapshot("allCompanies2");
                return cy.get(".industryCategory > :nth-child(2)").click();
            })
            .then(() => cy.get(".jurisdiction > :nth-child(3)").click())
            .then(() => cy.get(":nth-child(27)").click())
            .then(() => cy.get(".revenueRange > :nth-child(2)").click())
            .then(() => cy.get(".apply-button").click())
            .then(() => {
                cy.matchImageSnapshot("allCompanies3");
                return cy.get(".industryCategory").click();
            })
            .then(() => {
                cy.matchImageSnapshot("allCompanies4");
                return cy.get(".jurisdiction").click();
            })
            .then(() => {
                cy.matchImageSnapshot("allCompanies5");
                return cy.get(".revenueRange").click();
            })
            .then(() => {
                cy.matchImageSnapshot("allCompanies6");
                return cy.get(".location").click();
            })
            .then(() => {
                cy.matchImageSnapshot("allCompanies0");
            });
    });
});
