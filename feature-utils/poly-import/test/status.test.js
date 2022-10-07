import { Status, statusTypes } from "../src";
describe("Status logic works ", () => {
    it("Works with all status types", () => {
        for (const s of [statusTypes.success, statusTypes.warning]) {
            expect(new Status({ name: s }).isSuccess).toBeTruthy();
        }
        for (const s of [statusTypes.error, "Unknown"]) {
            expect(new Status({ name: s }).isSuccess).toBeFalsy();
        }
    });
});
