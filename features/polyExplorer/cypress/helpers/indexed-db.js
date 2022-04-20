export async function clearIndexedDB() {
    const databases = await indexedDB.databases();
    await Promise.all(
        databases.map((database) => indexedDB.deleteDatabase(database))
    );
}
