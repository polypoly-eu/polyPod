import { ClientOf, ObjectEndpointSpec, ServerOf, ValueEndpointSpec } from "../types";

// compilation tests

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function check<T>(t: T): void {
    /* intentionally left blank */
}

declare const client1: ClientOf<ValueEndpointSpec<number>>;
declare const client2: ClientOf<ValueEndpointSpec<Promise<number>>>;
declare const client3: ClientOf<
    ObjectEndpointSpec<{
        test(): ValueEndpointSpec<number>;
    }>
>;
declare const client4: ClientOf<
    ObjectEndpointSpec<{
        test(): ObjectEndpointSpec<{
            test2(): ValueEndpointSpec<number>;
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

            check<ClientOf<ValueEndpointSpec<number>>>(client3.test());
            check<Promise<number>>(client3.test()());

            check<Promise<number>>(client4.test().test2()());

            check<ServerOf<ValueEndpointSpec<number>>>(server1);

            check<ServerOf<ValueEndpointSpec<number>>>(server2);

            check<
                ServerOf<
                    ObjectEndpointSpec<{
                        test(): ValueEndpointSpec<number>;
                    }>
                >
            >(server3);

            check<
                ServerOf<
                    ObjectEndpointSpec<{
                        test(): ObjectEndpointSpec<{
                            test2(): ValueEndpointSpec<number>;
                        }>;
                    }>
                >
            >(server4);

            check<
                ServerOf<
                    ObjectEndpointSpec<{
                        test(): ObjectEndpointSpec<{
                            test2(): ValueEndpointSpec<number>;
                        }>;
                    }>
                >
            >(server5);

            check<
                ServerOf<
                    ObjectEndpointSpec<{
                        test(): ObjectEndpointSpec<{
                            test2(): ValueEndpointSpec<number>;
                        }>;
                    }>
                >
            >(server6);
        })
    ).toBeUndefined();
});
