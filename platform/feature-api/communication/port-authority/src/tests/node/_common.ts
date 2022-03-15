import { Port } from "../../port";
import { MessageChannel } from "worker_threads";
import { fromNodeMessagePort } from "../../node";
import { Resource } from "../../util";

export async function nodeLoopbackLifecycle<T, U>(): Promise<Resource<[Port<T, U>, Port<U, T>]>> {
  const { port1, port2 } = new MessageChannel();
  return {
    value: [fromNodeMessagePort(port1) as Port<T, U>, fromNodeMessagePort(port2) as Port<U, T>],
    cleanup: async () => {
      port1.close();
      port2.close();
    },
  };
}
