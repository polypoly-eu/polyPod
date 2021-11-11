const INDEX_ROUTE = "dist/index.html";
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
        cy.get(
            ":nth-child(1) > .company-group-companies > :nth-child(1)"
        ).click();
    });

    it(`should be able to access on the company short info`, () => {
        cy.get(".company-short-info > .info-box > .company-name");
    });

    it(`should show the companies which match with the filters`, () => {
        cy.get(".filter-button")
            .click()
            .then(() => {
                return cy.get(".industryCategory > :nth-child(2)").click();
            })
            .then(() => cy.get(".jurisdiction > :nth-child(3)").click())
            .then(() => cy.get(":nth-child(27)").click())
            .then(() => cy.get(".revenueRange > :nth-child(2)").click())
            .then(() => cy.get(".apply-button").click())
            .then(() => {
                return cy.get(".industryCategory").click();
            })
            .then(() => {
                return cy.get(".jurisdiction").click();
            })
            .then(() => {
                return cy.get(".revenueRange").click();
            })
            .then(() => {
                return cy.get(".location").click();
            });
    });
});
