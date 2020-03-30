import {PodEndpoint} from "../pod/endpoints";
import {Port, typesonPort, endpointClient, makeClient} from "@polypoly-eu/postoffice";
import {Pod, PolyIn, PolyOut} from "@polypoly-eu/poly-api";
import {typesonInstance} from "../pod/typeson";
import {DataFactory} from "rdf-js";

export function remotePod(port: Port, dataFactory: DataFactory): Pod {
    const typedPort = typesonPort(port, typesonInstance());
    const client = endpointClient<PodEndpoint>(makeClient(typedPort));

    return {
        get polyIn(): PolyIn {
            return {
                factory: dataFactory,
                add: (...quads) => client.call.polyIn().call.add(...quads).get,
                select: matcher => client.call.polyIn().call.select(matcher).get
            };
        },
        get polyOut(): PolyOut {
            return {
                readFile: (path, options) =>
                    client.call.polyOut().call.readFile(path, options).get,
                httpRequest: (url, method, body?, headers?) =>
                    client.call.polyOut().call.httpRequest(url, method, body, headers).get
            };
        }
    };
}
