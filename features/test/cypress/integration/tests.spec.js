const testIds = [
    "simpleJavaScriptCall",
    "podApiResolves",
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
        cy.visit("dist/index.html");
    });

    it("Missing test", () => {
        cy.get(".test-controls button").each((item) => {
            cy.wrap(item)
                .invoke("attr", "id")
                .then((id) => {
                    if (id === "runAll") return;
                    expect(testIds).to.include(id);
                });
        });
    });

    testIds.forEach((testId) => {
        it(testId, () => {
            const testButton = cy.get(`#${testId}`);
            testButton.click();
            testButton.parent().get("span").should("have.text", "OK");
        });
    });
});
