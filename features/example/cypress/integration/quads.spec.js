const ths = ['Subject','Verb','Predicate']
describe("Example", () => {
    it("should show quads correctly", () => {
        cy.visit("dist/index.html");
        cy.get("#feature").should("be.visible", {
            timeout: 30000
        });
        cy.get("table").should("be.visible");
        cy.get("tbody").should("be.visible");
        cy.get("tr").should("be.visible");
        cy.get("tr").then( items => {
            console.log("Items, ", items);
            for (let i = 0; i < ths.length; i++ ) {
                expect( items[i].to.contain.text( ths[i]))
            }
        });
    });
});