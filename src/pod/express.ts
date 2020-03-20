import {RequestHandler} from "express";
import {endpointServer, ServerOf} from "@polypoly-eu/postoffice";
import {rpcRouter} from "@polypoly-eu/postoffice/dist/lib-node";
import {PodEndpoint} from "./endpoints";
import {Pod} from "@polypoly-eu/poly-api";
import {typesonInstance} from "./typeson";

function serverOfPod(pod: Pod): ServerOf<PodEndpoint> {
    return {
        polyOut: () => pod.polyOut,
        polyIn: () => pod.polyIn
    };
}

export function router(pod: Pod): RequestHandler {
    return rpcRouter(
        endpointServer<PodEndpoint>(serverOfPod(pod)),
        typesonInstance()
    );
}