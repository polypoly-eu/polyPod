import { forward, join, loopback, rxMappingPort, mapSendPort, Port } from "../port";
import { PortSpecLifecycle } from "../specs/port";
import { ClientRequest, liftClient, liftServer, ServerResponse } from "../procedure";
import { ProcedureSpecLifecycle } from "../specs/procedure";
import { Bubblewrap } from "@polypoly-eu/bubblewrap";
import { mapResource, Resource } from "../util";

export const loopbackLifecycle: PortSpecLifecycle = async () => ({
    value: loopback(),
});

export function forwardLifecycle(l1: PortSpecLifecycle, l2: PortSpecLifecycle): PortSpecLifecycle {
    return async <T>() => {
        const ports1 = await l1<T>();
        const ports2 = await l2<T>();

        const [p1Send, p1Recv] = ports1.value;
        const [p2Send, p2Recv] = ports2.value;

        forward(p1Recv, p2Send);

        return {
            value: [p1Send, p2Recv],
            cleanup: async () => {
                if (ports1.cleanup) await ports1.cleanup();
                if (ports2.cleanup) await ports2.cleanup();
            },
        };
    };
}

export function bubblewrapLifecycle(
    l: PortSpecLifecycle,
    bubblewrap: Bubblewrap
): PortSpecLifecycle {
    return async () => {
        const ports = await l<Uint8Array>();
        return mapResource(ports, ([send, recv]) => {
            return [
                mapSendPort(send, (data) => bubblewrap.encode(data)),
                rxMappingPort(recv, (buf) => bubblewrap.decode(buf)),
            ];
        });
    };
}

export function flipLifecycle(
    l: <T>() => Promise<Resource<[Port<T, T>, Port<T, T>]>>
): PortSpecLifecycle {
    return async <T>() => {
        const ports = await l<T>();
        const [p1, p2] = ports.value;

        return {
            value: [p2, p1],
            cleanup: async () => {
                if (ports.cleanup) await ports.cleanup();
            },
        };
    };
}

export function procedureLiftedLifecycle(l: PortSpecLifecycle): ProcedureSpecLifecycle {
    return async <T, U>() => {
        const clientL = await l<ClientRequest<T>>();
        const serverL = await l<ServerResponse<U>>();

        const [clientSend, serverReceive] = clientL.value;
        const [serverSend, clientReceive] = serverL.value;

        const clientPort = join(clientSend, clientReceive);
        const serverPort = join(serverSend, serverReceive);

        return {
            value: [liftClient(clientPort), liftServer(serverPort)],
            cleanup: async () => {
                if (clientL.cleanup) await clientL.cleanup();
                if (serverL.cleanup) await serverL.cleanup();
            },
        };
    };
}
