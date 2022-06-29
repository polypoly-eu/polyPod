const buttonIds = [
    "simpleJavaScriptCall",
    "podApiResolves",
    "canCallPolyInAddWithNoQuads",
    "addSupportsQuadsWithDefaultGraph",
    "canPassEmptyMatcherToPolyInMatch",
    "canPassMatcherWithSubjectToPolyInMatch",
    "canPassMatcherWithPredicateToPolyInMatch",
    "canPassMatcherWithObjectToPolyInMatch",
    "canPassMatcherWithAllThreeFieldsToPolyInMatch",
    "clearQuadCollection",
    "addQuadToCollection",
];

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
        buttonIds.forEach((buttonId) => cy.get(`#${buttonId}`));
    });

    it("be able to click on all buttons", () =>
        buttonIds.forEach((buttonId) => cy.get(`#${buttonId}`).click()));
});
