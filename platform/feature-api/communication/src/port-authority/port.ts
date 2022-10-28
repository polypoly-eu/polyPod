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
 * Contravariant map operation for [[Handler]]s.
 * Applies the specified function to the input value _before_ passing it to the original handler.
 * And returns the handler to it.

 * @param handler - Handler<T>
 * @param f - (x: U) => T
 * @returns {Handler<T>} - the new handler
 */
export function mapHandler<T, U>(
    handler: Handler<T>,
    f: (x: U) => T
): Handler<U> {
    return (u) => handler(f(u));
}

/**
 * A half port that only sends messages.
 *
 * This interface provides very little guarantees beside invoking the [[Handler]]s of a [[ReceivePort]] “somewhere
 * else”. In particular, sending a message provides no observable behaviour. There are no temporal sequence guarantees when
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
 * @interface SendPort<Out>
 */
export interface SendPort<Out> {
    send(value: Out): void;
}

/**
 * Map operation for [[SendPort]]s.
 * The returned port behaves identically to the original port, but applies a function
 * to outgoing messages _before_ they are sent on the original port.
 * @param port - SendPort<Out>
 * @param f - (x: Out2) => Out
 * @returns {SendPort<Out2>} an instance of [[SendPort]] instantiated to the `In` class.
 */
export function mapSendPort<Out, Out2>(
    port: SendPort<Out>,
    f: (x: Out2) => Out
): SendPort<Out2> {
    return {
        send: (value: Out2) => port.send(f(value)),
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
 * @interface ReceivePort<In>
 */
export interface ReceivePort<In> {
    addHandler(handler: Handler<In>): void;
}

/**
 * Map operation for [[ReceivePort]]s. The returned port behaves identically to the original port, but applies a
 * function to incoming messages _before_ they are sent to the handlers.
 * @param {ReceivePort<In>} port - original port
 * @param {(x: In) => In2} f - the function to apply
 * @returns {ReceivePort<In2>} - an instance of [[ReceivePort]] instantiated to the `Out` class.
 */
export function mapReceivePort<In, In2>(
    port: ReceivePort<In>,
    f: (x: In) => In2
): ReceivePort<In2> {
    return {
        addHandler: (handler: Handler<In2>) =>
            port.addHandler(mapHandler(handler, f)),
    };
}

/**
 * A raw port for types `In` and `Out` is a [[SendPort]] for type `Out` and a [[ReceivePort]] for type `In`.
 *
 * A mapping operation for both type parameters is provided as [[mapPort]].
 *
 * @typeParam Out type of outgoing messages
 * @typeParam In type of incoming messages
 * @interface Port<In, Out>
 */
export interface Port<In, Out> extends SendPort<Out>, ReceivePort<In> {}

/**
 * Maps a [[Port]] on both the incoming (covariant) and outgoing (contravariant) messages.
 *
 * See [[mapSendPort]] and [[mapReceivePort]] for the components.
 * @param {Port} port - port to map
 * @param {(in1: In1) => In2} inf - incoming covariant messages
 * @param {(out2: Out2) => Out1} outf - outcoming contravariant messages
 * @returns {Port} - new port
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
 * @param {ReceivePort} from - port from which messages are forwarded
 * @param {SendPort} to - port to which messages are forwarded
 * @returns void
 */
export function forward<InOut>(
    from: ReceivePort<InOut>,
    to: SendPort<InOut>
): void {
    from.addHandler((t) => to.send(t));
}

/**
 * Constructs a pair of uni-directionally connected ports.
 * The result is a [[SendPort]] and a [[ReceivePort]] with the same type parameters.
 *
 * Messages sent through the [[SendPort]] are immediately handled by the handlers
 * registered with the [[ReceivePort]].
 * Communication is fully synchronous.
 * @returns a tuple of two elements of SendPort and ReceivedPort
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
 * @param {SendPort.<Out>} send - send port
 * @param {ReceivePort.<In>} receive - receive port
 * @returns {Port.<In,Out>} - new port sharing the underlying half ports
 */
export function join<In, Out>(
    send: SendPort<Out>,
    receive: ReceivePort<In>
): Port<In, Out> {
    return {
        send: (out: Out) => send.send(out),
        addHandler: (handler: Handler<In>) => receive.addHandler(handler),
    };
}

/**
 * Registers a one-off handler to a [[ReceivePort]] that listens for the next incoming message,
 * returning a promise that is resolved upon receiving that message.
 *
 * This function is the dual to [[SendPort.send]] because it allows to observe exactly one message.
 * @param {ReceivePort.<In>} port - port of the incoming message
 * @returns {Promise.<In>} - A promise that is resolved upon receiving that message
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
