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

export const pod =
    window.pod ||
    window.parent.pod ||
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
if (window.parent.pod && isLocalStorageAvailable()) {
    console.log("Migrating old storage");
    JSON.parse(localStorage.getItem(fakeStorageKey) || "[]").forEach((quad) => {
        console.log(quad);
        pod.polyIn.add(quad);
    });
    localStorage.removeItem(fakeStorageKey);
}

let fakeNavigationListener;

export const podNav = window.podNav || {
    setTitle: (title) => (document.title = title),
    setActiveActions: (actions) => {
        const actionKeys = {
            Escape: "back",
            s: "search",
            i: "info",
        };
        if (fakeNavigationListener)
            window.removeEventListener("keyup", fakeNavigationListener);
        else {
            const actionUsage = Object.entries(actionKeys)
                .map((pair) => `[${pair.join(" = ")}]`)
                .join(", ");
            console.log(
                `Keyboard polyPod navigation available: ${actionUsage}`
            );
        }
        fakeNavigationListener = function ({ key }) {
            const action = actionKeys[key];
            if (actions.includes(action))
                (podNav.actions[action] || (() => {}))();
        };
        window.addEventListener("keyup", fakeNavigationListener);
    },
};
