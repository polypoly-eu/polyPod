import { client, Procedure, RequestPort, ResponsePort, server } from "../procedure";
import fc, { Arbitrary, IAsyncProperty } from "fast-check";
import chai, { assert } from "chai";
import chaiAsPromised from "chai-as-promised";
import { recoverPromise, Resource } from "../util";

chai.use(chaiAsPromised);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const procs: Record<string, Procedure<any, any>> = {
    "number => number (success)": async (n: number) => n + 1,
    "number => number (fail-on-odd)": async (n: number) => {
        if (n % 2 == 0) return n - 1;
        else throw "odd";
    },
};

function probeFunctionEquality<T, U>(
    f1: (t: T) => Promise<U>,
    f2: (t: T) => Promise<U>,
    gen: Arbitrary<T>
): IAsyncProperty<[T]> {
    return fc.asyncProperty(gen, async (t) => {
        assert.deepEqual(await recoverPromise(f1(t)), await recoverPromise(f2(t)));
    });
}

export type ProcedureSpecLifecycle = <T, U>() => Promise<
    Resource<[RequestPort<T, U>, ResponsePort<T, U>]>
>;

export class ProcedureSpec<T, U> {
    constructor(
        private readonly lifecycle: ProcedureSpecLifecycle,
        private readonly proc: Procedure<T, U>,
        private readonly gen: Arbitrary<T>
    ) {}

    run(): void {
        let send: RequestPort<T, U>;
        let receive: ResponsePort<T, U>;
        let cleanup: () => Promise<void>;

        beforeEach(async () => {
            const result = await this.lifecycle<T, U>();
            send = result.value[0];
            receive = result.value[1];
            cleanup = async () => {
                if (result.cleanup) await result.cleanup();
            };
        });

        afterEach(async () => {
            await cleanup();
        });

        it("Emulates reference function", async () => {
            server(receive, this.proc);

            await fc.assert(probeFunctionEquality<T, U>(client(send), this.proc, this.gen));
        });

        it("Ignores additional handlers", async () => {
            // TODO multiplexing behaviour?

            let called = false;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const mockP: Procedure<any, any> = async () => {
                called = true;
            };

            server(receive, this.proc);
            server(receive, mockP);

            await fc.assert(probeFunctionEquality<T, U>(client(send), this.proc, this.gen));

            assert.isFalse(called);
        });
    }
}

export function procedureSpec(lifecycle: ProcedureSpecLifecycle): void {
    const gen = fc.integer(0, 100);

    for (const [label, proc] of Object.entries(procs))
        describe(label, () => {
            new ProcedureSpec(lifecycle, proc, gen).run();
        });
}
