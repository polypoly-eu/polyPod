const hexdump = (data) =>
    [...data].map((i) => i.toString(16).padStart(2, "0")).join(" ");

window.addEventListener("DOMContentLoaded", async () => {
    const pod = await window.pod;
    document.body.classList.remove("loading");
    const loadFileButton = document.getElementById("load-file");
    loadFileButton.addEventListener("click", async () => {
        const file = await pod.polyNav.pickFile();
        const sizeField = document.getElementById("file-info-size");
        const dataField = document.getElementById("file-info-data");
        if (!file) {
            sizeField.textContent = dataField.textContent = "";
            return;
        }
        sizeField.textContent = file.length;
        dataField.textContent = hexdump(file);
    });
});
