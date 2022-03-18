import { ClientOf, ObjectBackendEndpointSpec, ServerOf, ValueBackendEndpointSpec } from "../types";

// compilation tests

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function check<T>(t: T): void {
    /* intentionally left blank */
}

declare const client1: ClientOf<ValueBackendEndpointSpec<number>>;
declare const client2: ClientOf<ValueBackendEndpointSpec<Promise<number>>>;
declare const client3: ClientOf<
    ObjectBackendEndpointSpec<{
        test(): ValueBackendEndpointSpec<number>;
    }>
>;
declare const client4: ClientOf<
    ObjectBackendEndpointSpec<{
        test(): ObjectBackendEndpointSpec<{
            test2(): ValueBackendEndpointSpec<number>;
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

            check<ClientOf<ValueBackendEndpointSpec<number>>>(client3.test());
            check<Promise<number>>(client3.test()());

            check<Promise<number>>(client4.test().test2()());

            check<ServerOf<ValueBackendEndpointSpec<number>>>(server1);

            check<ServerOf<ValueBackendEndpointSpec<number>>>(server2);

            check<
                ServerOf<
                    ObjectBackendEndpointSpec<{
                        test(): ValueBackendEndpointSpec<number>;
                    }>
                >
            >(server3);

            check<
                ServerOf<
                    ObjectBackendEndpointSpec<{
                        test(): ObjectBackendEndpointSpec<{
                            test2(): ValueBackendEndpointSpec<number>;
                        }>;
                    }>
                >
            >(server4);

            check<
                ServerOf<
                    ObjectBackendEndpointSpec<{
                        test(): ObjectBackendEndpointSpec<{
                            test2(): ValueBackendEndpointSpec<number>;
                        }>;
                    }>
                >
            >(server5);

            check<
                ServerOf<
                    ObjectBackendEndpointSpec<{
                        test(): ObjectBackendEndpointSpec<{
                            test2(): ValueBackendEndpointSpec<number>;
                        }>;
                    }>
                >
            >(server6);
        })
    ).toBeUndefined();
});
