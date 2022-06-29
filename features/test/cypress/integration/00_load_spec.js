describe("Should work with basic functions", () => {
    beforeEach(() => {
        cy.visit("dist/index.html", {
            onBeforeLoad(win) {
                cy.stub(win.console, "log").as("consoleLog");
            },
        });
    });
    it(`should have displayed all buttons`, () => {
        // Should probably use introspection here...
        [
            "simpleJavaScriptCall",
            "podApiResolves",
            "canCallPolyInAddWithNoQuads",
            "addSupportsQuadsWithDefaultGraph",
            "canPassEmptyMatcherToPolyInMatch",
            "canPassMatcherWithSubjectToPolyInMatch",
            "canPassMatcherWithPredicateToPolyInMatch",
            "canPassMatcherWithObjectToPolyInMatch",
            "canPassMatcherWithObjectToPolyInMatch",
        ].forEach((buttonId) => cy.get(`#${buttonId}`));
    });
});
