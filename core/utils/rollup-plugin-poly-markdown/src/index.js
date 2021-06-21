import marked from "marked";
import { createFilter } from "rollup-pluginutils";

import { polyCustomTag } from "./polyCustomTag";

const ext = /\.md$/;

export default function polyMarkdownTranspiler(options = {}) {
    const filter = createFilter(
        options.include || ["**/*.md"],
        options.exclude
    );

    marked.use({ extensions: [polyCustomTag] });

    return {
        name: "polyMarkdownTranspiler",
        transform(md, id) {
            if (!ext.test(id) || !filter(id)) {
                return null;
            }

            const data = marked(md);

            return {
                code: `export default ${JSON.stringify(data.toString())};`,
                map: { mappings: "" },
            };
        },
    };
}
