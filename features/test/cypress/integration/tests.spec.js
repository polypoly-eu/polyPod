// TODO: Avoid hard coding these
const testIds = [
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
    testIds.forEach((testId) => {
        it(testId, () => {
            cy.visit("dist/index.html");
            const testButton = cy.get(`#${testId}`);
            testButton.click();
            testButton.parent().get("span").should("have.text", "OK");
        });
    });
});
