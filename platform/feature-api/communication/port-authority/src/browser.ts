/**
 * Browser-specific implementations of [[Port]].
 *
 * @packageDocumentation
 */

import { Handler, mapPort, Port, ReceivePort } from "./port";

/**
 * Converts a browser `MessagePort` into a raw [[Port]].
 *
 * The type of outgoing messages is unconstrained. Incoming messages are `MessageEvent`s; the raw value can be accessed
 * using the `data` field. It is not possible to transfer objects with this [[Port]].
 *
 * The [[TxPort.send]] and [[ReceivePort.addHandler]] methods delegate directly to the underlying Node implementation.
 * For typed operation, it is recommended to use [[mapPort]] with type coercions.q
 *
 * Note that Browser `MessagePort`s use the structured clone algorithm; that is, an object sent on the port will be
 * received as a different object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromBrowserMessagePort(port: MessagePort): Port<MessageEvent, any> {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        send(value: any): void {
            port.postMessage(value);
        },
        addHandler(handler: Handler<MessageEvent>): void {
            port.addEventListener("message", (message) => handler(message));
        },
    };
}

/**
 * The “inner half” of an iframe portal.
 *
 * It is possible to send and receive messages in an iframe using `window.parent` (from the iframe) and the iframe DOM
 * object (from the outer window). However, this becomes problematic when handling multiple clients whose requests need
 * to be multiplexed. The iframe portal solves this problem by establishing a dedicated, unencumbered line of
 * communication.
 *
 * The protocol works as follows:
 *
 * 1. the parent window creates the iframe
 * 2. the iframe immediately registers an event listener on the `message` event from the parent window, expecting to
 *    receive a `MessagePort`; this should be done before the iframe has been rendered fully
 * 3. the parent window waits until the iframe has been loaded (e.g. using `onload`)
 * 4. the parent window creates a fresh pair of ports using `new MessageChannel()` and transfers the second port down to
 *    the iframe using `postMessage`
 * 5. the iframe receives the `MessagePort` as a transferred object
 *
 * To aid multiplexing, a “secret” can be specified on both sides to recognize the `MessagePort` for a particular
 * channel. This is not a security feature.
 *
 * After the protocol ran, any future interaction between the iframe and its parent should happen on the `MessagePort`s
 * that have been exchanged. The entire protocol is abstracted using the pair of functions [[iframeInnerPort]] and
 * [[iframeOuterPort]].
 *
 * Usage example from within an iframe:
 *
 * ```html
 * <html>
 *     <head>
 *         <script type="module" src="bundle.js"></script>
 *         <script>
 *             const port = await iframeInnerPort("");
 *
 *             port.send("hello world!");
 *         </script>
 *     </head>
 * </html>
 * ```
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function iframeInnerPort(secret: string): Promise<Port<any, any>> {
    return new Promise((resolve, reject) => {
        const handler: Handler<MessageEvent> = (event) => {
            if (event.source !== window.parent || event.data !== secret) return;

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

/**
 * The “outer half” of an iframe portal. See [[iframeInnerPort]] for details about the protocol.
 *
 * This function creates a `MessageChannel` and starts the outer port immediately. Consider a scenario where the script
 * executing inside the iframe immediately sends messages to the port. Those messages may get lost, because this
 * function may not have returned yet, so a caller may not have had the opportunity to register a handler. In any case,
 * this is a race condition. To avoid this, callers may specify an `init` function that gets called with the port before
 * it is sent to the iframe. Sending messages down that port may result in a race condition in the iframe, so it is
 * prohibited by the type.
 *
 * Usage example from an outer window:
 *
 * ```
 * const iframe = await new Promise(resolve => {
 *     const dom = document.createElement("iframe");
 *     dom.onload = () => resolve(iframe);
 *     document.getElementById("container").appendChild(dom);
 * });
 * const port = iframeOuterPort("", iframe);
 * port.addHandler(console.dir);
 * ```
 */
export function iframeOuterPort(
    secret: string,
    iframe: HTMLIFrameElement,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    init?: (port: ReceivePort<any>) => void
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Port<any, any> {
    const { port1, port2 } = new MessageChannel();
    const rawPort = fromBrowserMessagePort(port1);
    const port = mapPort(
        rawPort,
        (event) => event.data,
        (any) => any
    );
    if (init) init(port);
    port1.start();
    iframe.contentWindow?.postMessage(secret, "*", [port2]);
    return port;
}
