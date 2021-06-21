const INDEX_ROUTE = "dist/index.html"

describe("Data stories", () => {
    it("should throw an error if the introduction pop up changes", () => {
        cy.visit(INDEX_ROUTE);
        cy.get(".onboarding-popup-content img").should("be.visible", {
            timeout: 10000,
        });
        cy.get(".onboarding-popup").matchImageSnapshot("introducction");
    });

    it(`
        should throw an error if the screen of the bars of the companies has changes
    `, () => {
        const numberSwipes = 8;
        cy.visit(INDEX_ROUTE);
        cy.get(".button-container button").click();
        cy.get(".featured-company-holder").matchImageSnapshot("company0");

        for (let i = 1; i < numberSwipes; i++) {
            cy.get(".featured-company-holder")
                .trigger("pointerdown", { which: 1 })
                .trigger("pointermove", "left")
                .trigger("pointerup", { force: true })
                .matchImageSnapshot(`company${i}`);
        }
    });
});
