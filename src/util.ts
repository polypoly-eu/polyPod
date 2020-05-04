import {FS} from "@polypoly-eu/poly-api";

export function bindFS(fs: FS): FS {
    return {
        readFile: fs.readFile.bind(fs),
        writeFile: fs.writeFile.bind(fs),
        stat: fs.stat.bind(fs)
    };
}