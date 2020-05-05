import {Consumer, mapReceivePort, Port} from "./port";
import {MessagePort} from "worker_threads";
import {ResponsePort} from "./procedure";
import {IRouter, ParamsDictionary} from "express-serve-static-core";
import {recoverPromise, Try} from "./util";
import {OptionsJson, Options} from "body-parser";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";

export function fromNodeMessagePort(port: MessagePort): Port<unknown, unknown> {
    return {
        send(value: unknown): void {
            port.postMessage(value);
        },
        addHandler(handler: Consumer<unknown>): void {
            port.on("message", handler);
        }
    };
}

export function routerPort<T, Body = any>(
    router: IRouter,
    contentType: string,
    format: (result: Try<T>) => Body
): ResponsePort<Body, T> {
    return {
        addHandler: handler => {
            router.post<ParamsDictionary, Body, Body>("/", async (request, response) => {
                const result = await recoverPromise(new Promise<T>(((resolve, reject) => {
                    handler({
                        request: request.body,
                        responder: {resolve, reject}
                    });
                })));

                const body = format(result);

                response.contentType(contentType);
                response.writeHead(200);
                response.write(body);
                response.end();
            });
        }
    };
}

export async function jsonRouterPort(
    router: IRouter,
    options?: OptionsJson
): Promise<ResponsePort<any, any>> {
    const contentType = "application/json";

    const {json} = await import("body-parser");

    router.use(json({
        ...options,
        strict: false,
        type: contentType
    }));

    return routerPort<any, any>(
        router,
        contentType,
        value => {
            if (value.tag === "success")
                return JSON.stringify({
                    response: value.value
                });
            else
                return JSON.stringify({
                    error: value.err
                });
        }
    );
}

export async function bubblewrapRouterPort(
    router: IRouter,
    bubblewrap: Bubblewrap,
    options?: Options
): Promise<ResponsePort<any, any>> {
    const contentType = "application/octet-stream";

    const {raw} = await import("body-parser");

    router.use(raw({
        ...options,
        type: contentType
    }));

    const rawPort = routerPort<any, Buffer>(
        router,
        contentType,
        value => Buffer.from(bubblewrap.encode(value))
    );

    return mapReceivePort(
        rawPort,
        data => ({
            responder: data.responder,
            request: bubblewrap.decode(data.request)
        })
    );
}