export type Consumer<T> = (t: T) => void;

export function mapConsumer<T, U>(consumer: Consumer<T>, f: (x: U) => T): Consumer<U> {
    return u => consumer(f(u));
}

export interface SendPort<Out> {
    send(value: Out): void;
}

export function mapSendPort<Out, Out2>(port: SendPort<Out>, f: (x: Out2) => Out): SendPort<Out2> {
    return {
        send: value => port.send(f(value))
    };
}

export interface ReceivePort<In> {
    addHandler(handler: Consumer<In>): void;
}

export function mapReceivePort<In, In2>(port: ReceivePort<In>, f: (x: In) => In2): ReceivePort<In2> {
    return {
        addHandler: handler => port.addHandler(mapConsumer(handler, f))
    };
}

export interface Port<In, Out> extends SendPort<Out>, ReceivePort<In> {
}

export function mapPort<In1, Out1, In2, Out2>(port: Port<In1, Out1>, inf: (in1: In1) => In2, outf: (out2: Out2) => Out1): Port<In2, Out2> {
    return {
        ...mapSendPort(port, outf),
        ...mapReceivePort(port, inf)
    };
}

export function forward<InOut>(from: ReceivePort<InOut>, to: SendPort<InOut>): void {
    from.addHandler(t => to.send(t));
}

export function connect<InOut>(port1: Port<InOut, InOut>, port2: Port<InOut, InOut>): void {
    forward(port1, port2);
    forward(port2, port1);
}

export function loopback<InOut>(): [SendPort<InOut>, ReceivePort<InOut>] {
    const handlers: Consumer<InOut>[] = [];
    return [
        {
            send: value => handlers.forEach(handler => handler(value))
        },
        {
            addHandler: handler => handlers.push(handler)
        }
    ];
}

export function join<In, Out>(send: SendPort<Out>, receive: ReceivePort<In>): Port<In, Out> {
    return {
        send: (out: Out) => send.send(out),
        addHandler: (handler: Consumer<In>) => receive.addHandler(handler)
    };
}