"use strict";
const fakeStorageKey = "fakePodStorage";

function isLocalStorageAvailable() {
    try {
        localStorage.setItem("test", "test");
        localStorage.removeItem("test");
        return true;
    } catch {
        return false;
    }
}

function createFakeStorage() {
    if (!isLocalStorageAvailable()) {
        console.log(
            "Neither polyIn nor localStorage available - " +
                "using in-memory storage backend"
        );
        const storage = [];
        return {
            get quads() {
                return storage;
            },
            set quads(quads) {
                storage.length = 0;
                storage.push(...quads);
            },
        };
    }

    console.log("polyIn not available - using localStorage storage backend");
    return {
        get quads() {
            return JSON.parse(localStorage.getItem(fakeStorageKey) || "[]");
        },
        set quads(quads) {
            localStorage.setItem(fakeStorageKey, JSON.stringify(quads));
        },
    };
}

// On Android, we currently expose the pod object in the container, but haven't
// found a way yet to inject it into the feature with the right timing,
// i.e. before any feature code is executed.
if (navigator.userAgent.toLowerCase().includes("android"))
    window.pod = window.parent.pod;

export const pod =
    window.pod ||
    (() => {
        const fakeStorage = createFakeStorage();
        return {
            polyIn: {
                select: async () => fakeStorage.quads,
                add: async (quad) =>
                    (fakeStorage.quads = [...fakeStorage.quads, quad]),
            },
            dataFactory: {
                quad: (subject, predicate, object) => ({
                    subject,
                    predicate,
                    object,
                }),
                namedNode: (value) => ({ value }),
            },
        };
    })();

// TODO: Migration code. Remove later and also disable localStorage in Android
if (window.pod && isLocalStorageAvailable()) {
    console.log("Migrating old storage");
    JSON.parse(localStorage.getItem(fakeStorageKey) || "[]").forEach((quad) => {
        console.log(JSON.stringify(quad));
        pod.polyIn.add(quad);
    });
    localStorage.removeItem(fakeStorageKey);
}
