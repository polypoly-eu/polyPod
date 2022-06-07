window.addEventListener(
    "message",
    ({ data: { command, action, origin } }) => {
        if (!origin.includes("localhost")) {
            return;
        }
        if (command === "triggerPolyNavAction") pod.polyNav.actions[action]();
    },
    false
);
