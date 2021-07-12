/*global zip*/

const hexdump = (data) =>
    [...data].map((i) => i.toString(16).padStart(2, "0")).join(" ");

window.addEventListener("DOMContentLoaded", async () => {
    const pod = await window.pod;
    document.body.classList.remove("loading");
    const loadFileButton = document.getElementById("load-file");
    loadFileButton.addEventListener("click", async () => {
        const fields = Object.fromEntries(
            ["size", "data", "list"].map((name) => [
                name,
                document.getElementById(`file-info-${name}`),
            ])
        );

        const file = await pod.polyNav.pickFile();
        if (!file) {
            Object.values(fields).forEach((field) => (field.textContent = ""));
            return;
        }
        fields.size.textContent = file.length;
        fields.data.textContent = hexdump(file);

        const reader = new zip.ZipReader(new zip.Uint8ArrayReader(file));
        const entries = await reader.getEntries();
        fields.list.textContent = entries
            .map((entry) => entry.filename)
            .join("\n");
    });
});
