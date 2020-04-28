import {Consumer, mapReceivePort, Port} from "./port";
import {MessagePort} from "worker_threads";
import {ReceiveAndReplyPort} from "./procedure";
import {IRouter, ParamsDictionary} from "express-serve-static-core";
import {recoverPromise, Try} from "./util";

export function fromMessagePort(port: MessagePort): Port<unknown, unknown> {
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
): ReceiveAndReplyPort<Body, T> {
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

export function jsonRouterPort(
    router: IRouter
): ReceiveAndReplyPort<any, any> {
    const rawPort = routerPort<any, string>(
        router,
        "application/json",
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

    return mapReceivePort(
        rawPort,
        data => ({
            responder: data.responder,
            request: data.request
        })
    );
}