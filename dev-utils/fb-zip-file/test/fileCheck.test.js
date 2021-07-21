import { commonStructure } from "../src/globals.js";
import { FiFileChecker } from "../src/fi-file-checker";

let fileChecker;
let zipFileRoutes;

beforeAll(() => {
    zipFileRoutes = Object.keys(commonStructure());
    fileChecker = new FiFileChecker(zipFileRoutes);
});

describe("Tautological test", () => {
    it("common keys should check", () => {
        expect(fileChecker.checkStructure(Object.keys(commonStructure()))).toBe(
            true
        );
    });
});

describe("Tests different route sets", () => {
    it("should pass with one route more", () => {
        let excessFileRoutes = zipFileRoutes.slice();
        excessFileRoutes.push("foo/bar/baz");
        expect(fileChecker.checkStructure(excessFileRoutes)).toBe(true);
    });
    it("should not pass with one route less", () => {
        let defectFileRoutes = zipFileRoutes.slice(0, -1);
        expect(fileChecker.checkStructure(defectFileRoutes)).toBe(false);
    });
});
