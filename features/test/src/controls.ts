export function initControls(container: HTMLElement): void {
    const runAllButton = document.getElementById("runAll");
    runAllButton.addEventListener("click", function () {
        const output = container.querySelector("span");
        output.textContent = "Running all...";
        runAllButton.disabled = true;
        mocha.run((failures) => {
            output.textContent = failures > 0 ? "Failed" : "All OK";
            runAllButton.textContent = "Reset";
            runAllButton.addEventListener("click", function () {
                location.href = location.href.replace(/\?.*/, "");
            });
            runAllButton.disabled = false;
        });
    });
}
