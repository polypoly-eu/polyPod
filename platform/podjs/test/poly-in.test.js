import { expect } from "@open-wc/testing";

describe("PolyIn", () => {
    let pod, quads;

    before(() => {
        ({ pod } = window);
        quads = [1, 2].map((id) =>
            pod.dataFactory.quad(
                pod.dataFactory.namedNode(`http://example.org/${id}/subject`),
                pod.dataFactory.namedNode(`http://example.org/${id}/predicate`),
                pod.dataFactory.namedNode(`http://example.org/${id}/object`)
            )
        );
    });

    it("adds quads", () => pod.polyIn.add(...quads));

    for (const method of ["match", "select"]) {
        it(`finds added quads (${method})`, async () => {
            const matches = await pod.polyIn[method]({});
            expect(matches).to.have.lengthOf(quads.length);
        });

        for (const prop of ["subject", "predicate", "object"]) {
            it(`finds quad by ${prop} (${method})`, async () => {
                const quad = quads[0];
                const result = await pod.polyIn[method]({ [prop]: quad[prop] });
                expect(result).to.have.lengthOf(1);
                expect(result[0].equals(quad)).to.be.true;
            });
        }
    }

    it("deletes quads", async () => {
        await pod.polyIn.delete(...quads);
        expect(await pod.polyIn.match({})).to.have.lengthOf(0);
    });
});
