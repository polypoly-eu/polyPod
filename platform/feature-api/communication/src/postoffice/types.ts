/**
 * This module defines the types used for specifying backend endpoints.
 *
 * A _backend endpoint_ is an API that can be implemented by a server and called by a
 * client. Backend endpoints are structured as objects with methods; methods may return
 * either values or a nested endpoint.
 *
 * An _endpoint specification_ is a mere type that is never used directly. See
 * [[BackendSpec]] for details.
 *
 * @packageDocumentation
 */

/**
 * Interface denoting a value backend endpoint of type `T`. This interface is purely
 * virtual and no instances are generated.
 */
export interface ValueBackendSpec<T> {
    endpointType: "value";
    value: T;
}

/**
 * Interface denoting a method backend endpoint of type `T`. This interface is purely
 * virtual and no instances are generated.
 */
export interface ObjectBackendSpec<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    T extends Record<string, (...args: any[]) => BackendSpec>
> {
    endpointType: "object";
    methods: T;
}

/**
 * A backend endpoint specification describes either a value ([[ValueBackendSpec]]) or
 * an object ([[ObjectBackendSpec]]). Values have no further structure and are
 * considered to be a return value representing the final response to the
 * client. Objects have methods that can be called by a client.
 *
 * A backend endpoint call is structured as `endpoint.f(...).g(...)`; i.e. the backend endpoint
 * object followed by a non-empty sequence of method calls with parameters. The
 * result of this chain is the _value_ that is returned to the client.
 *
 * Example:
 *
 * ```
 * type SimpleEndpoint = ObjectBackendSpec<{
 *     test1(param1: string): ValueBackendSpec<number>;
 *     test2(param1: string): ValueBackendSpec<number>;
 *     test3(parama: boolean, ...paramb: number[]): ValueBackendSpec<string>;
 * }>;
 * ```
 *
 * This is merely a type definition. It is not needed to define a constant or
 * function of this type.
 *
 * The only use of the type `SimpleEndpoint` in this example is to pass it as
 * type argument to [[ServerOf]] or [[ClientOf]]. These “meta types” compute a
 * server and client representation based on the above specification.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BackendSpec = ValueBackendSpec<any> | ObjectBackendSpec<any>;

/**
 * Wraps a type `T` into `Promise`, unless `T` is already a `Promise`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ForcePromise<T> = [T] extends [Promise<any>] ? T : Promise<T>;

/**
 * Type union of `T` and `Promise<T>`, unless `T` is already a `Promise`.
 */
export type MaybePromise<T> = T | ForcePromise<T>;

/**
 * Computes the type of the server-side implementation of a backend endpoint
 * specification.
 *
 * This type alias recursively traverses the specification.
 * [[ObjectBackendSpec]]s are preserved as objects with methods. The argument
 * types of those methods are unchanged. The return types are changed to
 * [[MaybePromise]]. [[ValueBackendSpec]]s are similarly changed to
 * [[MaybePromise]].
 *
 * Example:
 *
 * ```
 * type Backend = ObjectBackendSpec<{
 *     test(param: string): ValueBackendSpec<number>;
 *     nested(param: number): ObjectBackendSpec<{
 *         foo(parama: boolean, ...paramb: number[]): ValueBackendSpec<Promise<string>>;
 *     }>;
 * }>;
 *
 * ServerOf<Backend> ≡ {
 *     test(param: string): MaybePromise<number>;
 *     nested(param: number): MaybePromise<{
 *         foo(parama: boolean, ...paramb: number[]): Promise<string>;
 *     }>;
 * }
 * ```
 *
 * Note that the inner method `nested.foo` is assumed to always return a
 * `Promise<string>`, whereas the outer method `test` may return `number` or
 * `Promise<number>`.
 */
export type ServerOf<Spec extends BackendSpec> = Spec extends ValueBackendSpec<
    infer T
>
    ? MaybePromise<T>
    : Spec extends ObjectBackendSpec<infer T>
    ? {
          [P in keyof T]: T[P] extends (...args: infer Args) => infer Return
              ? Return extends BackendSpec
                  ? (...args: Args) => MaybePromise<ServerOf<Return>>
                  : never
              : never;
      }
    : never;

/**
 * This alias denotes the “end” of a call chain. It is a function taking no
 * arguments and returning a `Promise` of `T` (unless `T` is already a
 * `Promise`).
 *
 * Given a client for a backend endpoint specification, a call chain can be expressed
 * as follows:
 *
 * ```
 * const callable: Callable<number[]> = client.foo(3).bar("hi");
 * console.dir(await callable());
 * ```
 */
export type Callable<T> = () => ForcePromise<T>;

/**
 * Computes the type of the client-side proxy object for a backend endpoint
 * specification.
 *
 * This type alias recursively traverses the specification. The algorithm is
 * best illustrated with an example:
 *
 * ```
 * type Backend = ObjectBackendSpec<{
 *     test(param: string): ValueBackendSpec<number>;
 *     nested(param: number): ObjectBackendSpec<{
 *         foo(parama: boolean, ...paramb: number[]): ValueBackendSpec<Promise<string>>;
 *     }>;
 * }>;
 *
 * ClientOf<Backend> ≡ {
 *     test(param: string): Callable<T>;
 *     nested(param: number): {
 *         foo(parama: boolean, ...paramb: number[]): Callable<string>;
 *     };
 * }
 * ```
 *
 * Note that the inner method `nested.foo` is assumed to always return a
 * `Promise<string>`, whereas the outer method `test` may return `number` or
 * `Promise<number>`.
 *
 * Ultimately, when a user calls methods on this proxy object, these calls are
 * transmitted through a protocol to a server implementation that closely
 * mirrors the shape of the proxy.
 */
export type ClientOf<Spec extends BackendSpec> = Spec extends ValueBackendSpec<
    infer T
>
    ? Callable<T>
    : Spec extends ObjectBackendSpec<infer T>
    ? {
          [P in keyof T]: T[P] extends (...args: infer Args) => infer Return
              ? Return extends BackendSpec
                  ? (...args: Args) => ClientOf<Return>
                  : never
              : never;
      }
    : never;
