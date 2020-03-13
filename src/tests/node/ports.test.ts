import {portSpec} from "../../specs/port";
import {connect} from "../../ports";
import {messageChannelPortal} from "../../node/ports-messageport";

describe("Ports", () => {

    portSpec("MessageChannel", messageChannelPortal);

    portSpec("Connected channels", async () => {
        const portal1 = await messageChannelPortal();
        const portal2 = await messageChannelPortal();
        connect(portal1.port2, portal2.port1);
        return {
            port1: portal1.port1,
            port2: portal2.port2,
            cleanup: () => {
                portal1.cleanup();
                portal2.cleanup();
            }
        };
    });

});