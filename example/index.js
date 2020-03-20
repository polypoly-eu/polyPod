var Feature = (() => {
    class ExampleFeature {
        async init(pod) {
            console.log("hello");
            setTimeout(async () => {
                const {polyIn} = pod;
                const quad = polyIn.factory.triple(
                    polyIn.factory.namedNode("http://example.org/s"),
                    polyIn.factory.namedNode("http://example.org/p"),
                    polyIn.factory.namedNode("http://example.org/o")
                );
                await pod.polyIn.add(quad);
                const selected = await pod.polyIn.select({});
                const ul = document.createElement("ul");
                const root = document.getElementById("feature");
                root.innerHTML = "";
                root.appendChild(ul);
                for (const quad of selected) {
                    console.dir(quad);
                    const li = document.createElement("li");
                    ul.appendChild(li);
                    li.appendChild(document.createTextNode(JSON.stringify(quad)));
                }
            }, 100);
        }
    }

    return ExampleFeature;
})();