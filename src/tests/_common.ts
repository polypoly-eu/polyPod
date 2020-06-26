export interface Foobar {
    f(param: number): Promise<string>;
    g(param1: number, param2: string): Promise<number>;
    h(param: string, ...params: number[]): Promise<void>;
}

export const foobar: Foobar = {
    async f(param): Promise<string> {
        return String(param);
    },
    async g(param1, param2): Promise<number> {
        return param1 + param2.length;
    },
    async h(param, ...params): Promise<void> {
        return void (param + params.length);
    }
};
