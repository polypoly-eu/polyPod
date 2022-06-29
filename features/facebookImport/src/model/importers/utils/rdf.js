const facebookNs = "http://polypoly.coop/schema/facebook#";
const fbNsProperty = `${facebookNs}property:`;
const rdf = "https://www.w3.org/1999/02/22-rdf-syntax-ns#";
const xml = "http://www.w3.org/2001/XMLSchema#";

const termTypes = {
    blankNode: "BlankNode",
    namedNode: "NamedNode",
    literal: "Literal",
};

export function buildLiteral(value) {
    const { dataFactory: df } = window.pod;

    const literals = {
        object: () => null,
        number: (value) =>
            df.literal(
                value,
                `${xml}${Number.isInteger(value) ? "integer" : "decimal"}`
            ),
        string: (value) => df.literal(value),
        boolean: (value) => df.literal(value, `${xml}boolean`),
    };

    return literals[typeof value](value);
}

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
        buildLiteral(value)
    );
    ds.add(quad);
}

export function writeRdfSeq(subject, list) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    ds.add(
        df.quad(subject, df.namedNode(`${rdf}type`), df.namedNode(`${rdf}Seq`))
    );
    list.forEach((value, index) => {
        if (typeof value === "object") {
            const object = df.blankNode(`${rdf}_${index + 1}`);
            ds.add(
                df.quad(subject, df.namedNode(`${rdf}_${index + 1}`), object)
            );
            Array.isArray(value)
                ? writeRdfSeq(object, value)
                : writeRdfObj(object, value);
            return;
        }

        ds.add(
            df.quad(
                subject,
                df.namedNode(`${rdf}_${index + 1}`),
                buildLiteral(value)
            )
        );
    });
}

async function isBlankNodeObj(node) {
    const { polyIn: ds, dataFactory: df } = window.pod;

    return (
        await ds.match({
            subject: node,
            predicate: df.namedNode(`${rdf}type`),
        })
    ).some((quad) => quad.object.value === `${rdf}object`);
}

async function parseObjectNode(node) {
    if (node.termType === termTypes.blankNode) {
        return (await isBlankNodeObj(node))
            ? await readRdfObj(node)
            : await readRdfSeq(node);
    }
    if (node.termType === termTypes.namedNode) {
        //TODO: parse namedNodes
        return null;
    }
    return node.value;
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
    const result = await Promise.all(
        quads.map(async (quad) => {
            const index = quad.predicate.value.match(
                new RegExp(`${rdf}_([1-9]*)`)
            )?.[1];
            if (!index) return null;
            return {
                index: parseInt(index, 10) - 1,
                value: await parseObjectNode(quad.object),
            };
        })
    );
    return result
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
            df.namedNode(`${rdf}object`)
        )
    );

    Object.entries(obj).forEach(([key, value]) =>
        ds.add(
            df.quad(
                subject,
                df.namedNode(`${fbNsProperty}${key}`),
                buildLiteral(value)
            )
        )
    );
}

export async function readRdfObj(subject) {
    //only strings supported
    const { polyIn: ds } = window.pod;
    const quads = await ds.match({ subject });
    if (
        !quads.some(
            (quad) =>
                quad.predicate.value === `${rdf}type` &&
                quad.object.value === `${rdf}object`
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
    Literal: (quad) => removeLiteral(quad),
    BlankNode: (quad) => removeBlankNode(quad),
    NamedNode: (quad) => removeConnectionToNamedNode(quad),
};

export async function removeFileFromRdf(archiveId) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({ subject: df.namedNode(archiveId) });
    for (let quad of quads) {
        removingByTermType[quad.object.termType](quad);
    }
}

function removeLiteral(quad) {
    const { polyIn: ds } = window.pod;
    ds.delete(quad);
}

function removeConnectionToNamedNode(quad) {
    const { polyIn: ds } = window.pod;
    ds.delete(quad);
}

async function removeBlankNode(quad) {
    const { polyIn: ds } = window.pod;
    const obj = quad.object;
    const blankQuads = await ds.match({
        subject: obj,
    });
    for (let blankQuad of blankQuads) {
        removingByTermType[blankQuad.object.termType](blankQuad);
    }
    ds.delete(quad);
}
