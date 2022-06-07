window.addEventListener(
    "message",
    ({ data: { command, action, origin } }) => {
        if (window.location.href.indexOf(origin) === 0) {
            return;
        }
        if (command === "triggerPolyNavAction") pod.polyNav.actions[action]();
    },
    false
);
