export function initControls(container: HTMLElement): void {
    const resetButton = document.getElementById("reset") as HTMLButtonElement;
    resetButton.addEventListener("click", function () {
        location.href = location.href.replace(/\?.*/, "");
    });

    const runAllButton = document.getElementById("runAll") as HTMLButtonElement;
    runAllButton.addEventListener("click", function () {
        const output = container.querySelector("span");
        output.textContent = "Running all...";
        runAllButton.disabled = true;
        // @ts-ignore - seems we're missing some types for Mocha
        mocha.run((failures: number) => {
            output.textContent = failures > 0 ? "Failed" : "All OK";
        });
    });
}
