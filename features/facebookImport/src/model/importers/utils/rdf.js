const facebookNs = "http://polypoly.coop/schema/facebook#";
const fbNsProperty = `${facebookNs}property:`;
const rdf = "https://www.w3.org/1999/02/22-rdf-syntax-ns#";

export async function readAttrFromRdf(archiveUri, attr) {
    const { dataFactory, polyIn } = window.pod;
    const result = await polyIn.match({
        subject: dataFactory.namedNode(archiveUri),
        predicate: dataFactory.namedNode(facebookNs + attr),
    });
    return result.find(({ object }) => object.value)?.object?.value;
}

export async function writeAttrToRdf(archiveUri, attr, value) {
    const { dataFactory, polyIn } = window.pod;
    const quad = dataFactory.quad(
        dataFactory.namedNode(archiveUri),
        dataFactory.namedNode(facebookNs + attr),
        dataFactory.literal(value)
    );
    polyIn.add(quad);
}

export function writeRdfSeq(id, list) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const subject = df.blankNode(facebookNs + id);
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

export async function readRdfSeq(id) {
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({ subject: df.blankNode(facebookNs + id) });
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

export async function writeRdfObject(id, obj) {
    //only strings supported
    const { dataFactory: df, polyIn: ds } = window.pod;
    const subject = df.blankNode(facebookNs + id);

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

export async function readRdfObject(id) {
    //only strings supported
    const { dataFactory: df, polyIn: ds } = window.pod;
    const quads = await ds.match({ subject: df.blankNode(facebookNs + id) });
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
