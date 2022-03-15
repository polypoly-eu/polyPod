import { mapPort, Port } from "../../port";
import { fromBrowserMessagePort } from "../../browser";
import { Resource } from "../../util";

export async function browserLoopbackLifecycle<T, U>(): Promise<
  Resource<[Port<T, U>, Port<U, T>]>
> {
  const { port1, port2 } = new MessageChannel();
  port1.start();
  port2.start();
  return {
    value: [
      mapPort(
        fromBrowserMessagePort(port1),
        (event) => event.data as T,
        (u) => u
      ),
      mapPort(
        fromBrowserMessagePort(port2),
        (event) => event.data as U,
        (t) => t
      ),
    ],
    cleanup: async () => {
      port1.close();
      port2.close();
    },
  };
}
