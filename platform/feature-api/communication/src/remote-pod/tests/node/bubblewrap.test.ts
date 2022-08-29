import { podBubblewrapClasses } from "../../remote";

describe("Classes are accounted for", () => {
    it("has the right number of classes", () => {
        expect(Object.keys(podBubblewrapClasses).length).toBe(6);
    });
});
