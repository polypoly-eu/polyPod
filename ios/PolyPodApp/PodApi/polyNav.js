window.addEventListener("message", ({ data: { command, action } }) => {
    if (command === "triggerPolyNavAction")
        pod.polyNav.actions[action]();
}, false);
