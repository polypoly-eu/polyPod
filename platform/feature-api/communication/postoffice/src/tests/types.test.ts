import { ClientOf, ObjectBackendSpec, ServerOf, ValueBackendSpec } from "../types";

// compilation tests

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function check<T>(t: T): void {
    /* intentionally left blank */
}

declare const client1: ClientOf<ValueBackendSpec<number>>;
declare const client2: ClientOf<ValueBackendSpec<Promise<number>>>;
declare const client3: ClientOf<
    ObjectBackendSpec<{
        test(): ValueBackendSpec<number>;
    }>
>;
declare const client4: ClientOf<
    ObjectBackendSpec<{
        test(): ObjectBackendSpec<{
            test2(): ValueBackendSpec<number>;
        }>;
    }>
>;
declare const server1: number;
declare const server2: Promise<number>;
declare const server3: {
    test(): Promise<number>;
};
declare const server4: {
    test(): {
        test2(): number;
    };
};
declare const server5: {
    test(): Promise<{
        test2(): number;
    }>;
};
declare const server6: {
    test(): Promise<{
        test2(): Promise<number>;
    }>;
};

it("Should work with complicated objects", () => {
    expect(
        check(() => {
            check<Promise<number>>(client1());

            check<Promise<number>>(client2());

            check<ClientOf<ValueBackendSpec<number>>>(client3.test());
            check<Promise<number>>(client3.test()());

            check<Promise<number>>(client4.test().test2()());

            check<ServerOf<ValueBackendSpec<number>>>(server1);

            check<ServerOf<ValueBackendSpec<number>>>(server2);

            check<
                ServerOf<
                    ObjectBackendSpec<{
                        test(): ValueBackendSpec<number>;
                    }>
                >
            >(server3);

            check<
                ServerOf<
                    ObjectBackendSpec<{
                        test(): ObjectBackendSpec<{
                            test2(): ValueBackendSpec<number>;
                        }>;
                    }>
                >
            >(server4);

            check<
                ServerOf<
                    ObjectBackendSpec<{
                        test(): ObjectBackendSpec<{
                            test2(): ValueBackendSpec<number>;
                        }>;
                    }>
                >
            >(server5);

            check<
                ServerOf<
                    ObjectBackendSpec<{
                        test(): ObjectBackendSpec<{
                            test2(): ValueBackendSpec<number>;
                        }>;
                    }>
                >
            >(server6);
        })
    ).toBeUndefined();
});
