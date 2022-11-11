describe("All", () => {
    it("succeed", () => {
        cy.visit("dist/index.html");
        const testButton = cy.get("#runAll");
        testButton.click();
        testButton.siblings("span").should("have.text", "All OK");
    });
});
