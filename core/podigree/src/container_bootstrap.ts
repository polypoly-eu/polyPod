import { Port, Handler, mapPort, fromBrowserMessagePort } from "@polypoly-eu/port-authority";
import { DataFactory } from "@polypoly-eu/rdf";
import { RemoteClientPod } from "./remote";
import { AsyncPod } from "./async";

// This is almost exactly the same implementation as in port-authority,
// but without a check if "event.source !== window.parent" check
export function iframeInnerPort(secret: string): Promise<Port<any, any>> {
    return new Promise((resolve, reject) => {
        const handler: Handler<MessageEvent> = (event) => {
            if (event.data !== secret) return;

            if (event.ports.length === 1) {
                event.ports[0].start();
                const rawPort = fromBrowserMessagePort(event.ports[0]);
                resolve(
                    mapPort(
                        rawPort,
                        (event) => event.data,
                        (any) => any
                    )
                );
            } else {
                reject(`Malformed message`);
            }

            window.removeEventListener("message", handler);
        };
        window.addEventListener("message", handler);
    });
}

window.pod = new AsyncPod(
    iframeInnerPort("").then((pod) => RemoteClientPod.fromRawPort(pod)),
    new DataFactory(false)
);
