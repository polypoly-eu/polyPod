import {RequestHandler, Router} from "express";
import {rpcRouter} from "../../node/rpc-express";
import {endpointServer, endpointTypeson, ServerOf} from "../../rpc";
import {ComplexEndpoint, simpleEndpointImpl} from "../../specs/rpc-port-client";
import {fsEndpoint} from "../../endpoints/node-fs";
import {Volume} from "memfs";

export const complexEndpointImpl: ServerOf<ComplexEndpoint> = {
    simple: () => Promise.resolve(simpleEndpointImpl),
    fs: () => fsEndpoint(Volume.fromJSON({
        "/test": "file-content"
    }).promises as any)
};

export function KarmaRPCPlugin(): RequestHandler {
    const router = Router();
    router.use("/rpc", rpcRouter(endpointServer<ComplexEndpoint>(complexEndpointImpl), endpointTypeson));
    return router;
}