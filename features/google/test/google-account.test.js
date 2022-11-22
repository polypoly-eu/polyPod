import GoogleAccount from "../src/model/entities/google-account";

describe("Basic account", () => {
    let googleAccount;
    beforeAll(() => {
        googleAccount = new GoogleAccount();
    });

    it("should include all known groups", () => {
        const theseGroups = googleAccount.dataGroups;
        const knownTitles = [
            "Place Visits",
            "Access Log",
            "Activity Segments",
            "Activities",
        ];
        expect(theseGroups.map((g) => g.title)).toStrictEqual(knownTitles);
    });
});
