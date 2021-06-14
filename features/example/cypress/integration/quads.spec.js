const ths = ['Subject','Predicate','Object']
describe("Example", () => {
    it("should show quads correctly", () => {
        cy.visit("dist/index.html");
        cy.get("#feature").should("be.visible", {
            timeout: 40000
        });
        cy.get("table").should("be.visible");
        cy.get("tbody").should("be.visible");
        cy.get("tr").should("be.visible");
        cy.get("tr").should("have.length",3).eq(0).should("contain.text", "Subject");
        for (let i = 0; i < ths.length; i++ ) {
            cy.get("th").eq(i).should("contain.text", ths[i]);
            cy.get("td").eq(i).should("contain.text", "/" + ths[i][0].toLowerCase());
        };
    });
});