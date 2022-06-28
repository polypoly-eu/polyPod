const facebookNs = "http://polypoly.coop/schema/facebook#";
const fbNsProperty = `${facebookNs}property:`;
const rdf = "https://www.w3.org/1999/02/22-rdf-syntax-ns#";

export async function readAttrFromRdf(archiveUri, attr) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const result = await ds.match({
        subject: df.namedNode(archiveUri),
        predicate: df.namedNode(facebookNs + attr),
    });
    return result?.find(({ object }) => object.value)?.object?.value;
}

export async function writeAttrToRdf(archiveUri, attr, value) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quad = df.quad(
        df.namedNode(archiveUri),
        df.namedNode(facebookNs + attr),
        df.literal(value)
    );
    ds.add(quad);
}

export function writeRdfSeq(subject, list) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    ds.add(
        df.quad(subject, df.namedNode(`${rdf}type`), df.namedNode(`${rdf}Seq`))
    );
    list.forEach((value, index) =>
        ds.add(
            df.quad(
                subject,
                df.namedNode(`${rdf}_${index + 1}`),
                df.literal(value)
            )
        )
    );
}

export async function readRdfSeq(subject) {
    const { polyIn: ds } = window.pod;
    const quads = await ds.match({ subject });
    if (
        !quads.some(
            (quad) =>
                quad.predicate.value === `${rdf}type` &&
                quad.object.value === `${rdf}Seq`
        )
    )
        return null;

    return quads
        .map((quad) => {
            const index = quad.predicate.value.match(
                new RegExp(`${rdf}_([1-9]*)`)
            )?.[1];
            if (!index) return null;
            return { index: parseInt(index, 10) - 1, value: quad.object.value };
        })
        .filter((quad) => !!quad)
        .sort((a, b) => a.index - b.index)
        .map(({ value }) => value);
}

export async function writeRdfObj(subject, obj) {
    //only strings supported
    const { dataFactory: df, polyIn: ds } = window.pod;
    ds.add(
        df.quad(
            subject,
            df.namedNode(`${rdf}type`),
            df.namedNode(`${facebookNs}Obj`)
        )
    );

    Object.entries(obj).forEach(([key, value]) =>
        ds.add(
            df.quad(
                subject,
                df.namedNode(`${fbNsProperty}${key}`),
                df.literal(value)
            )
        )
    );
}

export async function readRdfObj(subject) {
    //only strings supported
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({ subject });
    if (
        !quads.some(
            (quad) =>
                quad.predicate.value === `${rdf}type` &&
                quad.object.value === `${facebookNs}Obj`
        )
    )
        return null;

    const obj = {};
    quads.forEach((quad) => {
        const property = quad.predicate.value;
        if (!property.match(new RegExp(fbNsProperty))) return null;
        obj[property.replace(fbNsProperty, "")] = quad.object.value;
    });
    return obj;
}

export async function writeSeqToFile(archiveUri, attr, list) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const object = df.blankNode(facebookNs + attr);
    ds.add(
        df.quad(
            df.namedNode(archiveUri),
            df.namedNode(facebookNs + attr),
            object
        )
    );
    writeRdfSeq(object, list);
}

export async function readSeqFromFile(archiveUri, attr) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({
        subject: df.namedNode(archiveUri),
        predicate: df.namedNode(facebookNs + attr),
    });
    if (!quads.some((quad) => quad?.object?.value?.includes(facebookNs)))
        return null;

    return readRdfSeq(quads[0].object);
}

export async function readObjFromFile(archiveUri, attr) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({
        subject: df.namedNode(archiveUri),
        predicate: df.namedNode(facebookNs + attr),
    });
    if (!quads.some((quad) => quad?.object?.value?.includes(facebookNs)))
        return null;

    return readRdfObj(quads[0].object);
}

export async function writeObjToFile(archiveUri, attr, obj) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const object = df.blankNode(facebookNs + attr);
    ds.add(
        df.quad(
            df.namedNode(archiveUri),
            df.namedNode(facebookNs + attr),
            object
        )
    );
    writeRdfObj(object, obj);
}

const removingByTermType = {
    Literal: () => removeLiteral(obj),
};

export async function removeFileFromRdf(archiveId) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({ subject: df.namedNode(archiveId) });
    console.log(quads);
    for (let quad of quads) {
        const obj = quad.object;
        removingByTermType[obj.termType](obj);
    }
}

function removeLiteral(obj) {
    const { dataFactory: df, polyIn: ds } = window.pod;
}
