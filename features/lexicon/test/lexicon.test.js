import Lexicon from "../src/Lexicon.js";
import lexiconData from "../src/data/lexicon.json";

let lexicon;

beforeAll(() => {
    lexicon = new Lexicon(lexiconData);
});

describe("Test Lexicon object", () => {
    it("has been created correctly", () => {
        expect(lexicon).toBeDefined();
        expect(lexicon).toHaveProperty("_data");
    });

    it("checks descriptive methods", () => {
        const groups = lexicon.groups;
        const aGroup = groups[0];
        expect(lexicon.group(aGroup)).toBeDefined();
        expect(lexicon.groupEntries(aGroup)).toBeDefined();
    });

    it("can search some terms", () => {
        ["data", "privacy", "protection"].forEach((term) => {
            expect(lexicon.search(term)).toBeDefined();
        });
    });
});
