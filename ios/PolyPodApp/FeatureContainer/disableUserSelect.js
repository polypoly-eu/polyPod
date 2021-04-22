window.addEventListener("load", () => {
    const sheet = document.createElement("style");
    sheet.innerHTML =
        "* { -webkit-touch-callout: none; -webkit-user-select: none }";
    document.head.appendChild(sheet);
});
