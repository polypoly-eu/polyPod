export interface MockStore {
    update(query: string): Promise<void>;
    query(query: string): Promise<string>;
}

export class MockStore implements MockStore {
    update(_query: string): Promise<void> {
        return new Promise(() => null);
    }

    query(_query: string): Promise<string> {
        return new Promise(() => "");
    }
}
