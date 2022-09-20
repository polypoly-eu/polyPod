import { SPARQLQueryResult } from "./api";

export interface MockStore {
    update(query: string): Promise<void>;
    query(query: string): Promise<SPARQLQueryResult>;
}

export class MockStore implements MockStore {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    update(_query: string): Promise<void> {
        return new Promise(() => null);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query(_query: string): Promise<SPARQLQueryResult> {
        return new Promise(() => false);
    }
}
