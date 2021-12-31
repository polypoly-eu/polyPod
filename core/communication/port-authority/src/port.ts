/**
 * This module specifies the raw [[Port]] abstraction and combinators.
 *
 * @packageDocumentation
 */

/**
 * A handler for type `T` is a function accepting a `T` and returning `void`.
 *
 * Handlers are expected to return without throwing an error.
 */
export type Handler<T> = (t: T) => void;

/**
 * Contravariant map operation for [[Handler]]s. Applies the specified function on the value _before_ it is passed to
 * the handler.
 */
export function mapHandler<T, U>(handler: Handler<T>, f: (x: U) => T): Handler<U> {
    return (u) => handler(f(u));
}

/**
 * A half port that only sends messages.
 *
 * This interface provides very little guarantees beside invoking the [[Handler]]s of a [[ReceivePort]] “somewhere
 * else”. In particular, sending a message provides no observable behaviour. There are no temporal guarantees when
 * sending multiple messages.
 *
 * Futhermore, it is not guaranteed that values sent through a port arrive unmodified at the other end. For example,
 * JSON stringification or variants of the
 * [Structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
 * may be applied to these values. This happens because – in general – ports may be used to communicate across (logical
 * or physical) process boundaries.
 *
 * The [[SendPort.send]] method is expected to always return successfully without throwing an error.
 *
 * Implementations of this may be synchronous, for example the port returned by [[loopback]].
 */
export interface SendPort<Out> {
    send(value: Out): void;
}

/**
 * Map operation for [[SendPort]]s. The returned port behaves identically to the original port, but applies a function
 * to outgoing messages _before_ they are sent on the original port.
 */
export function mapSendPort<Out, In>(port: SendPort<Out>, f: (x: In) => Out): SendPort<In> {
    return {
        send: (value) => port.send(f(value)),
    };
}

/**
 * A half port that only receives messages.
 *
 * Messages are handled asynchronously by adding (also called _registering_) [[Handler]]s. Ports should invoke all
 * handlers, but may do so in arbitrary order. If present, at least one handler must be invoked. Throwing an error in a
 * handler is undefined behaviour.
 *
 * Handlers may be `async` functions, but ports are not expected to `await` the results. This means that rejected
 * promises may go unhandled, which may be undefined behaviour depending on the platform.
 *
 * Note that it is impossible to remove handlers once added to the port. This, and custom multiplexing logic is out of
 * scope for this abstraction, but can be implemented by users on top of raw ports.
 */
export interface ReceivePort<In> {
    addHandler(handler: Handler<In>): void;
}

/**
 * Map operation for [[ReceivePort]]s. The returned port behaves identically to the original port, but applies a
 * function to incoming messages _before_ they are sent to the handlers.
 */
export function mapReceivePort<In, In2>(
    port: ReceivePort<In>,
    f: (x: In) => In2
): ReceivePort<In2> {
    return {
        addHandler: (handler) => port.addHandler(mapHandler(handler, f)),
    };
}

/**
 * A raw port for types `In` and `Out` is a [[SendPort]] for type `Out` and a [[ReceivePort]] for type `In`.
 *
 * A mapping operation for both type parameters is provided as [[mapPort]].
 *
 * @typeParam Out type of outgoing messages
 * @typeParam In type of incoming messages
 */
export interface Port<In, Out> extends SendPort<Out>, ReceivePort<In> {}

/**
 * Maps a [[Port]] on both the incoming (covariant) and outgoing (contravariant) messages.
 *
 * See [[mapSendPort]] and [[mapReceivePort]] for the components.
 */
export function mapPort<In1, Out1, In2, Out2>(
    port: Port<In1, Out1>,
    inf: (in1: In1) => In2,
    outf: (out2: Out2) => Out1
): Port<In2, Out2> {
    return {
        ...mapSendPort(port, outf),
        ...mapReceivePort(port, inf),
    };
}

/**
 * Adds a handler to a [[ReceivePort]] that forwards all incoming messages to a [[SendPort]].
 *
 * @param from port from which messages are forwarded
 * @param to port to which messages are forwarded
 */
export function forward<InOut>(from: ReceivePort<InOut>, to: SendPort<InOut>): void {
    from.addHandler((t) => to.send(t));
}

/**
 * Bi-directionally forwards messages between two [[Port]]s.
 *
 * Both ports must have identical incoming and outcoming types. This function uses [[forward]] to forward messages from
 * the first port to the second, and again for the other direction.
 */
export function connect<InOut>(port1: Port<InOut, InOut>, port2: Port<InOut, InOut>): void {
    forward(port1, port2);
    forward(port2, port1);
}

/**
 * Constructs a pair of uni-directionally connected ports. The result is a [[SendPort]] and a [[ReceivePort]] with the
 * same type parameters.
 *
 * Messages sent through the [[SendPort]] are immediately handled by the handlers registered with the [[ReceivePort]].
 * Communication is fully synchronous.
 */
export function loopback<InOut>(): [SendPort<InOut>, ReceivePort<InOut>] {
    const handlers: Handler<InOut>[] = [];
    return [
        {
            send: (value) => handlers.forEach((handler) => handler(value)),
        },
        {
            addHandler: (handler) => handlers.push(handler),
        },
    ];
}

/**
 * Merges a [[SendPort]] and [[ReceivePort]] together to a full [[Port]].
 *
 * The resulting port shares the implementation of the underlying half ports.
 */
export function join<In, Out>(send: SendPort<Out>, receive: ReceivePort<In>): Port<In, Out> {
    return {
        send: (out: Out) => send.send(out),
        addHandler: (handler: Handler<In>) => receive.addHandler(handler),
    };
}

/**
 * Registers a one-off handler to a [[ReceivePort]] that listens for the next incoming message, returning a promise
 * that is resolved upon receiving that message.
 *
 * This function is the dual to [[SendPort.send]] because it allows to observe exactly one message.
 */
export function receiveSingle<In>(port: ReceivePort<In>): Promise<In> {
    return new Promise((resolve) => {
        let done = false;
        const handler: Handler<In> = (data) => {
            if (done) return;

            done = true;
            resolve(data);
        };
        port.addHandler(handler);
    });
}
