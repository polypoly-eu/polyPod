import {DataFactory, NamedNode} from "rdf-js";

export function namespace(baseIRI: string, dataFactory: DataFactory<any>): Record<string, NamedNode> {
    return new Proxy({}, {
        get: (target, property: string) =>
            dataFactory.namedNode(`${baseIRI}${property}`)
    });
}
