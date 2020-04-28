import {Resource} from "../../specs/_util";
import {Port} from "../../port";
import {MessageChannel} from "worker_threads";
import {fromMessagePort} from "../../node";

export async function nodeLoopbackLifecycle<T, U>(): Promise<Resource<[Port<T, U>, Port<U, T>]>> {
    const {port1, port2} = new MessageChannel();
    return {
        value: [fromMessagePort(port1) as Port<T, U>, fromMessagePort(port2) as Port<U, T>],
        cleanup: async () => {
            port1.close();
            port2.close();
        }
    };
}
