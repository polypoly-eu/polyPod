export const assert = chai.assert;

export async function assertAsyncThrows(fn): Promise<void> {
    try {
        await fn();
    } catch (e) {
        return;
    }
    assert.fail(`expected '${fn}' to throw an error`);
}
