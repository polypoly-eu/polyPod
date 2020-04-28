import {client, Procedure, ReceiveAndReplyPort, SendAndReplyPort, server} from "../procedure";
import {mock, probeFunctionEquality, Resource} from "./_util";
import fc, {Arbitrary} from "fast-check";
import chai, {assert} from "chai";
import chaiAsPromised from "chai-as-promised";

chai.use(chaiAsPromised);

const procs: Record<string, Procedure<any, any>> = {
    "number => number (success)":
        async (n: number) =>
            n + 1,
    "number => number (fail-on-odd)":
        async (n: number) => {
            if (n % 2 == 0)
                return n - 1;
            else
                throw "odd";
        }
};

export type ProcedureSpecLifecycle = <T, U> () => Promise<Resource<[SendAndReplyPort<T, U>, ReceiveAndReplyPort<T, U>]>>;

export class ProcedureSpec<T, U> {

    constructor(
        private readonly lifecycle: ProcedureSpecLifecycle,
        private readonly proc: Procedure<T, U>,
        private readonly gen: Arbitrary<T>
    ) {}

    run(): void {
        let send: SendAndReplyPort<T, U>;
        let receive: ReceiveAndReplyPort<T, U>;
        let cleanup: () => Promise<void>;

        beforeEach(async () => {
            const result = await this.lifecycle<T, U>();
            send = result.value[0];
            receive = result.value[1];
            cleanup = async () => {
                if (result.cleanup)
                    await result.cleanup();
            };
        });

        afterEach(async () => {
            await cleanup();
        });

        it("Emulates reference function", async () => {
            server(receive, this.proc);

            await fc.assert(probeFunctionEquality<T, U>(
                client(send),
                this.proc,
                this.gen
            ));
        });

        it("Ignores additional handlers", async () => {
            // TODO multiplexing behaviour?

            const mockP = mock(() => Promise.reject());

            server(receive, this.proc);
            server(receive, mockP);

            await fc.assert(probeFunctionEquality<T, U>(
                client(send),
                this.proc,
                this.gen
            ));

            assert.isEmpty(mockP.calls);
        });

    }

}

export function procedureSpec(lifecycle: ProcedureSpecLifecycle): void {
    const gen = fc.integer(100);

    for (const [label, proc] of Object.entries(procs))
        describe(label, () => {
            new ProcedureSpec(
                lifecycle,
                proc,
                gen
            ).run();
        });
}
