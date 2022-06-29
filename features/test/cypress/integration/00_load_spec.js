describe("Should work with basic functions", () => {
    beforeEach(() => {
        cy.visit("dist/index.html", {
            onBeforeLoad(win) {
                cy.stub(win.console, "log").as("consoleLog");
            },
        });
    });
    it(`Should be able co make a simple call`, () => {
        cy.get("#simpleJavaScriptCall");
    });
});
