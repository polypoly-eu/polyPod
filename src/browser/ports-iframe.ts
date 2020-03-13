import {Handler, Port} from "../ports";
import {fromMessagePort} from "./ports-messageport";

export async function iframeInnerPort(secret: string): Promise<Port> {
    return new Promise<Port>((resolve, reject) => {
        const handler: Handler = event => {
            if (event.source !== window.parent || event.data !== secret)
                return;

            if (event.ports.length === 1) {
                event.ports[0].start();
                resolve(fromMessagePort(event.ports[0]));
            } else {
                reject(`Malformed message`);
            }

            window.removeEventListener("message", handler);
        };
        window.addEventListener("message", handler);
    });
}

export function iframeOuterPort(secret: string, iframe: HTMLIFrameElement): Port {
    const {port1, port2} = new MessageChannel();
    port1.start();
    iframe.contentWindow!.postMessage(secret, "*", [port2]);
    return fromMessagePort(port1);
}
