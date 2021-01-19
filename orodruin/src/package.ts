import { Manifest } from "@polypoly-eu/customs";
import { promises as fs } from "fs";
import { join } from "path";
import { render } from "ejs";
import copy from "recursive-copy";

export async function pkg(rootDir: string, manifest: Manifest, target: string): Promise<void> {
    const template = await fs.readFile(join(__dirname, "../data/container.html.ejs"), "utf-8");
    const html = render(template, {
        pod: "browser",
    });

    await fs.writeFile(join(target, "index.html"), html, "utf-8");

    await fs.copyFile(
        require.resolve("@polypoly-eu/podigree/dist/bootstrap.js"),
        join(target, "pod.js")
    );

    await fs.copyFile(join(__dirname, "../dist/container.js"), join(target, "container.js"));

    await fs.mkdir(join(target, "feature"));

    await copy(join(rootDir, manifest.root), join(target, "feature"));
}
