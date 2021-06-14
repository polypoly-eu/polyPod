describe("Example", () => {
    it("should show quads correctly", () => {
        cy.visit("dist/index.html");
        cy.get(".feature").should("be.visible", {
            timeout: 1000
        });
    });
});