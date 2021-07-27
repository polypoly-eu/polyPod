import "../../dist/pod";
import commonStructure from "../../src/static/commonStructure";
import { BlobWriter, ZipWriter, TextReader } from "@zip.js/zip.js";

const noDataFileName = "no-data.txt";
let blob;

before(async () => {
    const zipBlobWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(zipBlobWriter);
    for (let key in commonStructure) {
        if (commonStructure[key] === []) {
            await zipWriter.add(
                `${key}/${noDataFileName}`,
                new TextReader("\n")
            );
        } else {
            commonStructure[key].forEach(async (element) => {
                await zipWriter.add(
                    `${key}/${element}`,
                    new TextReader("[ 'foo' ]\n")
                );
            });
        }
    }
    await zipWriter.close();
    blob = await zipBlobWriter.getData();
});

describe("Simple tests", () => {
    it("finds window.pod", () => {
        expect(window.pod).to.not.be.null;
    });
    it("imports structure JSON", () => {
        expect(commonStructure).to.not.be.null;
        ["events", "location", "posts", "profile_information"].forEach(
            (key) => {
                expect(Object.keys(commonStructure)).to.include(key);
            }
        );
    });

    it("creates a zipfile with that structure", () => {
        expect(blob).to.not.be.null;
    });
});
