/**
 * Node-specific implementations of [[Port]] and [[ResponsePort]].
 *
 * @packageDocumentation
 */

import { MessagePort } from "worker_threads";
import { Handler, Port } from "./port";

/**
 * Converts a Node `MessagePort` into a raw [[Port]] with unknown types.
 *
 * The [[SendPort.send]] and [[ReceivePort.addHandler]] methods delegate directly to the underlying Node implementation.
 * For typed operation, it is recommended to use [[mapPort]] with type coercions.
 *
 * It is not possible to transfer objects with this [[Port]].
 *
 * Note that Node `MessagePort`s constructed from `MessageChannel` use a variant of the structured clone algorithm; that
 * is, an object sent on the port will be received as a different object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function fromNodeMessagePort(port: MessagePort): Port<any, any> {
    return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        send(value: any): void {
            port.postMessage(value);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        addHandler(handler: Handler<any>): void {
            port.on("message", handler);
        },
    };
}
