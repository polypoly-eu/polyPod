import { startWithCompanies } from "../helpers";

describe("All companies", () => {
    beforeEach(() => {
        startWithCompanies();
    });

    it(`should show the companies that pass the filters`, () => {
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
