"use strict";

// We used to provide a fake implementation of the pod API here, for development
// purposes, but in the meantimeswitched to pod.js for this. Once pod.js
// supports the navigation API, and once the migration code isn't necessary
// anymore, we can get rid of this file.
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
