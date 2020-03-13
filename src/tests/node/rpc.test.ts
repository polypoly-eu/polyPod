import {endpointServer, endpointTypeson} from "../../rpc";
import express from "express";
import {rpcRouter} from "../../node/rpc-express";
import {fromFetch} from "../../ports-fetch";
// @ts-ignore
import fetch from "node-fetch";
import {Server} from "http";
import {ComplexEndpoint, rpcPortClientSpec} from "../../specs/rpc-port-client";
import {complexEndpointImpl} from "../_util/karma-middleware";

describe("RPC", () => {

    let server: Server;

    beforeAll(() => {
        const expr = express();
        expr.use("/rpc", rpcRouter(endpointServer<ComplexEndpoint>(complexEndpointImpl), endpointTypeson));
        server = expr.listen(5000);
    });

    afterAll(() => {
        server.close();
    });

    rpcPortClientSpec(
        "Client operation",
        () => fromFetch("http://localhost:5000/rpc", fetch),
        true
    );

});
