import "../../dist/pod";
import commonStructure from "../../src/static/commonStructure";
import { BlobWriter, ZipWriter, TextReader } from "@zip.js/zip.js";
import Storage from "../../src/model/storage.js";

const noDataFileName = "no-data.txt";
let blob;
let storage;
let pod;

before(async () => {
    pod = await window.pod;
    const zipBlobWriter = new BlobWriter("application/zip");
    const zipWriter = new ZipWriter(zipBlobWriter);
    for (let [key, value] of commonStructure) {
        if (!value.length) {
            await zipWriter.add(
                `${key}/${noDataFileName}`,
                new TextReader("\n")
            );
        } else {
            value.forEach(async (element) => {
                await zipWriter.add(
                    `${key}/${element}`,
                    new TextReader("[ 'foo' ]\n")
                );
            });
        }
    }
    await zipWriter.close();
    blob = await zipBlobWriter.getData();

    storage = new Storage(pod);
    storage.changeListener();
});

describe("Simple tests", () => {
    it("finds window.pod", () => {
        expect(pod).to.not.be.null;
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

describe("Test file storage", () => {
    it("can add and (possibly) delete a file ", () => {
        const thisDate = new Date();
        storage.addFile({ data: blob, time: thisDate }).then(() => {
            expect(storage.files.length).to.equal(1);
            expect([...storage.files[0].data]).to.equal([...blob]);
            storage.removeFile({ id: thisDate.getTime() }).then(() => {
                expect(storage.files.length).to.equal(0);
            });
        });
    });
});
