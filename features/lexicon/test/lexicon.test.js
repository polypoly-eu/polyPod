import Lexicon from "../src/Lexicon.js";
import lexiconData from "../src/data/lexicon.json"

let lexicon;

beforeAll(() => {
    lexicon = new Lexicon( lexiconData )
});


describe("Test Lexicon object", () => {
    it("has been created correctly", () => {
        expect(lexicon).toBeDefined();
        expect(lexicon).toHaveProperty("_data");
    });
});
