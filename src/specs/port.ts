import fc from "fast-check";
import {makeClient, makeServer, Port, Portal, typesonPort} from "../ports";
import {Typeson, builtin} from "@polypoly-eu/bubblewrap";

class PortSpec {

    constructor(
        protected readonly name: string,
        protected readonly portal: Portal
    ) {}

    run(): void {
        describe(this.name, () => {
            let port1: Port, port2: Port;
            let cleanup: () => void;

            beforeEach(async () => {
                const portal = await this.portal();
                port1 = portal.port1;
                port2 = portal.port2;
                cleanup = portal.cleanup.bind(portal);
            });

            afterEach(() => {
                cleanup();
            });

            it("Responds correctly", async () => {
                const client = makeClient<number, number>(port1);
                makeServer<number, number>(port2, n => Promise.resolve(n / 2));
                await fc.assert(fc.asyncProperty(fc.integer(), async req => {
                    await expectAsync(client(req)).toBeResolvedTo(req / 2);
                }));
            });

            it("Rejects correctly", async () => {
                const client = makeClient<number, number>(port1);
                makeServer<number, number>(port2, n => new Promise((resolve, reject) => {
                    if (n % 2 == 0)
                        resolve(n);
                    else
                        reject(n.toString());
                }));
                await fc.assert(fc.asyncProperty(fc.integer(), async req => {
                    if (req % 2 == 0)
                        await expectAsync(client(req)).toBeResolvedTo(req);
                    else
                        await expectAsync(client(req)).toBeRejectedWith(req.toString());
                }));
            });

            it("Handles exceptions gracefully", async () => {
                const typeson = new Typeson().register(builtin);
                const client = makeClient<number, number>(typesonPort(port1, typeson));
                makeServer<number, number>(typesonPort(port2, typeson), () => {
                    throw new Error("nope");
                });
                await fc.assert(fc.asyncProperty(fc.integer(), async req => {
                    await expectAsync(client(req)).toBeRejectedWithError("nope");
                }));
            });
        });
    }

}

export function portSpec(name: string, portal: Portal): void {
    new PortSpec(name, portal).run();
}