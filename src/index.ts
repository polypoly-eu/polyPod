export type AsyncFunction<Args extends unknown[], Result> = (...args: Args) => Promise<Result>;
export type AnyAsyncFunction = AsyncFunction<any[], any>;
export type AsyncRecord<This> = Record<keyof This, AnyAsyncFunction>;

export type UnPromise<T> = T extends Promise<infer U> ? U : never;

export interface AsyncOperation<This extends AsyncRecord<This>, Name extends keyof This> {
    name: Name;
    self: This;
    args: Parameters<This[Name]>;
}

export type Filter<This extends AsyncRecord<This>, Name extends keyof This> = (
    ret: UnPromise<ReturnType<This[Name]>>
) => ReturnType<This[Name]>;

export type Eliminators<This extends AsyncRecord<This>> = {
    [Name in keyof This]: (
        self: This,
        ...args: Parameters<This[Name]>
    ) => Filter<This, Name> | undefined;
};

export function eliminate<This extends AsyncRecord<This>, Name extends keyof This>(
    operation: AsyncOperation<This, Name>,
    eliminators: Eliminators<This>
): Filter<This, Name> | undefined {
    return eliminators[operation.name](operation.self, ...operation.args);
}

export interface Interceptor<This extends AsyncRecord<This>> {
    guard<Name extends keyof This>(
        operation: AsyncOperation<This, Name>
    ): Promise<Filter<This, Name> | undefined>;
}

export const nullInterceptor: Interceptor<any> = {
    async guard(): Promise<undefined> {
        return;
    },
};

export function intercept<This extends AsyncRecord<This>>(
    object: This,
    interceptor: Interceptor<This>
): This {
    return new Proxy(object, {
        get<Name extends keyof This>(target: This, name: Name): This[Name] {
            const func: This[Name] = target[name];

            type RawReturn = UnPromise<ReturnType<This[Name]>>;

            const wrapped = async function (...args: Parameters<This[Name]>): Promise<RawReturn> {
                const operation: AsyncOperation<This, Name> = {
                    name,
                    self: target,
                    args,
                };

                const nullFilter = (async (t) => t) as Filter<This, Name>;
                const filter = (await interceptor.guard(operation)) || nullFilter;

                const result: RawReturn = await func.call(target, ...args);

                return filter(result);
            };

            return wrapped as This[Name];
        },
    });
}
