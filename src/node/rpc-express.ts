import {EndpointReqRes} from "../rpc";
import {RequestHandler, Router} from "express";
import {Typeson} from "@polypoly-eu/bubblewrap";
import {json} from "body-parser";

export function rpcRouter(reqres: EndpointReqRes, typeson: Typeson): RequestHandler {
    const router = Router();
    router.use(json({
        limit: "10mb"
    }));
    router.post("/", async (request, response) => {
        const req = typeson.revive(request.body);
        let json: any;
        try {
            const res = await reqres(req.request);
            json = typeson.encapsulate({
                response: res,
                id: req.id
            });
        }
        catch (ex) {
            json = typeson.encapsulate({
                error: ex,
                id: req.id
            });
        }
        response.setHeader("Content-Type", "application/json");
        response.writeHead(200);
        response.write(JSON.stringify(json));
        response.end();
    });
    return router;
}