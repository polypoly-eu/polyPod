import {podBubblewrapClasses} from "./endpoints";
import {Bubblewrap} from "@polypoly-eu/bubblewrap";
import {endpointBubblewrapClasses} from "@polypoly-eu/postoffice";
import {mapPort, Port} from "@polypoly-eu/port-authority";

export const podBubblewrap = Bubblewrap
    .create(endpointBubblewrapClasses)
    .addHandlers(podBubblewrapClasses);

export function bubblewrapPort(rawPort: Port<Uint8Array, Uint8Array>): Port<any, any> {
    return mapPort(
        rawPort,
        buf => podBubblewrap.decode(buf),
        data => podBubblewrap.encode(data)
    );
}

export {dataFactory} from "@polypoly-eu/rdf";
