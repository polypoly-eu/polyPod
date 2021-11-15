const INDEX_ROUTE = "dist/index.html";

describe("Data stories", () => {
    it("should throw an error if the introduction pop up changes", () => {
        cy.visit(INDEX_ROUTE);
        cy.get(".onboarding-popup-content img").should("be.visible", {
            timeout: 10000,
        });
    });
});
