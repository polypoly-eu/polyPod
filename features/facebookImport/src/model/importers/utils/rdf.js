const namespace = "http://polypoly.coop/schema/fbImport/#";

export async function readAttrFromRdf(accountId, attr) {
    const { dataFactory, polyIn } = window.pod;
    const result = await polyIn.match({
        subject: dataFactory.namedNode(namespace + accountId),
        predicate: dataFactory.namedNode(namespace + attr),
    });
    console.log(result);
    return result
        .find(({ object }) => object.value)
        ?.object?.value?.replace(namespace, "");
}

export async function writeAttributeToRdf(accountId, attr, value) {
    const { dataFactory, polyIn } = window.pod;
    const quad = dataFactory.quad(
        dataFactory.namedNode(namespace + accountId),
        dataFactory.namedNode(namespace + attr),
        dataFactory.namedNode(namespace + value)
    );
    polyIn.add(quad);
}
