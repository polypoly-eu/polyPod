"use strict";

// We used to provide a fake implementation of the pod API here, for development
// purposes, but in the meantime switched to pod.js for this. Once the migration
// code isn't necessary anymore, we can get rid of this file.
export const pod = window.pod;

// TODO: Migration code. Remove later and also disable localStorage in Android
function migrateAndroidStorage() {
    const localStorageAvailable = (() => {
        try {
            localStorage.setItem("test", "test");
            localStorage.removeItem("test");
            return true;
        } catch {
            return false;
        }
    })();
    if (!localStorageAvailable) return;

    console.log("Migrating old storage");
    const fakeStorageKey = "fakePodStorage";
    JSON.parse(localStorage.getItem(fakeStorageKey) || "[]").forEach((quad) => {
        console.log(JSON.stringify(quad));
        pod.polyIn.add(quad);
    });
    localStorage.removeItem(fakeStorageKey);
}
migrateAndroidStorage();
