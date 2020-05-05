import {Handler, mapPort, Port} from "./port";

export function fromBrowserMessagePort(port: MessagePort): Port<MessageEvent, any> {
    return {
        send(value: unknown): void {
            port.postMessage(value);
        },
        addHandler(handler: Handler<MessageEvent>): void {
            port.addEventListener("message", message => handler(message));
        }
    };
}
export async function iframeInnerPort(secret: string): Promise<Port<any, any>> {
    return new Promise((resolve, reject) => {
        const handler: Handler<MessageEvent> = event => {
            if (event.source !== window.parent || event.data !== secret)
                return;

            if (event.ports.length === 1) {
                event.ports[0].start();
                const rawPort = fromBrowserMessagePort(event.ports[0]);
                resolve(mapPort(rawPort, event => event.data, any => any));
            } else {
                reject(`Malformed message`);
            }

            window.removeEventListener("message", handler);
        };
        window.addEventListener("message", handler);
    });
}

export function iframeOuterPort(secret: string, iframe: HTMLIFrameElement): Port<any, any> {
    const {port1, port2} = new MessageChannel();
    port1.start();
    iframe.contentWindow!.postMessage(secret, "*", [port2]);
    const rawPort = fromBrowserMessagePort(port1);
    return mapPort(rawPort, event => event.data, any => any);
}
