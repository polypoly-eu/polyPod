window.podNav = (() => {
    const commands = ["setTitle", "setActiveActions"];
    function sendPodNavCommand(name, data) {
        window.parent.postMessage({
            command: "podNav",
            text: JSON.stringify({ name, data }),
        }, "*");
    };
    return Object.fromEntries(commands.map((name) => [name, (data) => sendPodNavCommand(name, data)]));
})();
