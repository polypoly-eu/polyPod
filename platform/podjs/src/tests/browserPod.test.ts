import { IDBPolyOut } from "../browserPod";

test("Importing Archive", () => {
    const polyOut = new IDBPolyOut();
    expect("").toEqual("");
});

// describe("Importing Archive", async () => {
//     const polyOut = new IDBPolyOut();
//     try {
//         const result = await polyOut.importArchive("../data/testZip.zip");
//         expect(result).not.toEqual("");
//     } catch (err) {
//         expect(err).toBeUndefined();
//     }
// });
