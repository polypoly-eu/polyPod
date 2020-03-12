import fc, {Arbitrary} from "fast-check";
import {Typeson, Constructor} from "../index";
import {MessageChannel} from "worker_threads";

class TypesonSpec<T> {

    constructor(
        protected readonly name: string,
        protected readonly arbitrary: Arbitrary<T>,
        protected readonly typeson: Typeson
    ) {}

    run(): void {
        describe(this.name, () => {
            it("encapsulate/revive (simple)", () => {
                fc.assert(fc.property(this.arbitrary, t => {
                    const revived = this.typeson.revive(this.typeson.encapsulate(t));
                    expect(revived).toEqual(t);
                }));
            });

            it("encapsulate/revive (JSON)", () => {
                fc.assert(fc.property(this.arbitrary, t => {
                    const revived =
                        this.typeson.revive(
                            JSON.parse(
                                JSON.stringify(this.typeson.encapsulate(t))
                            )
                        );
                    expect(revived).toEqual(t);
                }));
            });

            it("encapsulate/revive (MessageChannel)", async () => {
                await fc.assert(fc.asyncProperty(this.arbitrary, async t => {
                    const {port1, port2} = new MessageChannel();
                    const encapsulated = this.typeson.encapsulate(t);
                    const promise = new Promise<T>(resolve => {
                        port2.on("message", msg => {
                            resolve(this.typeson.revive(msg));
                        });
                        port1.postMessage(encapsulated);
                    });
                    await expect(promise).resolves.toEqual(t);
                    port1.close();
                    port2.close();
                }));
            });
        });
    }

}

class ExtendedTypesonSpec<T> extends TypesonSpec<T> {

    constructor(
        name: string,
        arbitrary: Arbitrary<T>,
        typeson: Typeson,
        protected readonly constructor: Constructor<T>
    ) {
        super(name, arbitrary, typeson);
    }

    run(): void {
        super.run();

        describe(`Extended ${this.name}`, () => {
            it("encapsulate/revive (prototype)", () => {
                fc.assert(fc.property(this.arbitrary, t => {
                    const revived = this.typeson.revive(this.typeson.encapsulate(t));
                    expect(revived).toBeInstanceOf(this.constructor);
                }));
            });
        });
    }

}

export function typesonSpec<T>(name: string, arbitrary: Arbitrary<T>, typeson: Typeson, constructor?: Constructor<T>): void {
    if (constructor)
        new ExtendedTypesonSpec(name, arbitrary, typeson, constructor).run();
    else
        new TypesonSpec(name, arbitrary, typeson).run();
}
