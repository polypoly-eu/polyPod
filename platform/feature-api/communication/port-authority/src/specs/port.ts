import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import fc, { Arbitrary } from "fast-check";

import { ReceiverPort, TxPort } from "../port";
import { Resource } from "../util";

chai.use(chaiAsPromised);

export type PortSpecLifecycle = <T>() => Promise<Resource<[TxPort<T>, ReceiverPort<T>]>>;

interface Fixture<T> {
    send: TxPort<T>;
    receive: ReceiverPort<T>;
    cleanup(): Promise<void>;
}

export class PortSpec<T> {
    constructor(
        private readonly lifecycle: PortSpecLifecycle,
        private readonly gen: Arbitrary<T>
    ) {}

    private async createFixture(): Promise<Fixture<T>> {
        const result = await this.lifecycle<T>();
        return {
            send: result.value[0],
            receive: result.value[1],
            cleanup: async () => {
                if (result.cleanup) await result.cleanup();
            },
        };
    }

    run(): void {
        it("Transmits messages", async () => {
            let fixture: Fixture<T>;

            const prop = fc.asyncProperty(this.gen, async (t) => {
                const received = new Promise<T>((resolve) => {
                    fixture.receive.addHandler(resolve);
                });

                fixture.send.send(t);

                await assert.eventually.deepEqual(received, t);
            });

            await fc.assert(
                prop
                    .beforeEach(async () => {
                        fixture = await this.createFixture();
                    })
                    .afterEach(() => fixture.cleanup())
            );
        });

        it("Transmits messages to multiple handlers", async () => {
            let fixture: Fixture<T>;

            const prop = fc.asyncProperty(this.gen, fc.integer(0, 10), async (t, count) => {
                const promises: Promise<T>[] = [];
                for (let i = 0; i < count; ++i)
                    promises.push(
                        new Promise<T>((resolve) => {
                            fixture.receive.addHandler(resolve);
                        })
                    );

                fixture.send.send(t);

                for (const p of promises) await assert.eventually.deepEqual(p, t);
            });

            await fc.assert(
                prop
                    .beforeEach(async () => {
                        fixture = await this.createFixture();
                    })
                    .afterEach(() => fixture.cleanup())
            );
        });

        it("Transmits multiple messages", async () => {
            let fixture: Fixture<T>;

            const prop = fc.asyncProperty(fc.array(this.gen), async (ts) => {
                const count = ts.length;
                fc.pre(count > 0);

                const received = new Promise<T[]>((resolve) => {
                    const elements: T[] = [];
                    fixture.receive.addHandler((t) => {
                        elements.push(t);
                        if (elements.length === count) resolve(elements);
                    });
                });

                for (const t of ts) fixture.send.send(t);

                assert.sameDeepMembers(await received, ts);
            });

            await fc.assert(
                prop
                    .beforeEach(async () => {
                        fixture = await this.createFixture();
                    })
                    .afterEach(() => fixture.cleanup())
            );
        });
    }
}

export function portSpec(lifecycle: PortSpecLifecycle): void {
    describe("number", () => {
        new PortSpec(lifecycle, fc.integer()).run();
    });

    describe("string", () => {
        new PortSpec(lifecycle, fc.string()).run();
    });

    describe("Array<number | string>", () => {
        new PortSpec(lifecycle, fc.array(fc.oneof(fc.integer(), fc.string()))).run();
    });

    describe("Uint8Array", () => {
        new PortSpec(
            lifecycle,
            fc.array(fc.integer(0, 255)).map((array) => Uint8Array.from(array))
        ).run();
    });
}
