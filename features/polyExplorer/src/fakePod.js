"use strict";

const fakeStorageKey = "fakePodStorage";

const fakeStorage = {
    get quads() {
        return JSON.parse(localStorage.getItem(fakeStorageKey) || "[]");
    },
    set quads(quads) {
        localStorage.setItem(fakeStorageKey, JSON.stringify(quads));
    },
};

// The polyPod does already export window.pod, but it isn't implemented yet, so
// we ignore the existing window.pod object here and always go with the fake for
// now.
export const pod = window.pod || {
    polyIn: {
        select: async () => fakeStorage.quads,
        add: async (quad) => (fakeStorage.quads = [...fakeStorage.quads, quad]),
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
