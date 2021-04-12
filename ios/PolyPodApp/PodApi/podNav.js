window.podNav = (() => {
    const commands = ["setTitle", "setActiveActions", "openUrl"];
    function sendPodNavCommand(name, data) {
        window.parent.postMessage({
            command: "podNav",
            text: JSON.stringify({ name, data }),
        }, "*");
    };
    return Object.fromEntries(commands.map((name) => [name, (data) => sendPodNavCommand(name, data)]));
})();

window.addEventListener("message", ({ data: { command, action } }) => {
    if (command === "triggerPodNavAction")
        podNav.actions[action]();
}, false);
