export async function clearIndexedDB() {
    const databases = await indexedDB.databases();
    databases.forEach((database) => indexedDB.deleteDatabase(database));
}
