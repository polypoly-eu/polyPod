import {Package} from "./package";

interface RawManifest {
    name: string;
    jsPath: string;
    cssPath: string;
}

export type Manifest = Readonly<RawManifest>;

export function getManifest(pkg: Package): Manifest {
    return {
        name: pkg.name,
        jsPath: pkg.main,
        cssPath: pkg.polypoly.outputStyle
    };
}
