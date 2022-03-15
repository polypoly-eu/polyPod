import { SemVer } from "semver";
export interface MainManifest {
    readonly name: string;
    readonly version: SemVer;
}
export interface FeatureManifest {
    readonly description: string;
    readonly thumbnail: string;
    readonly primaryColor: string;
    readonly links: unknown;
    readonly translations: unknown;
}
export interface Manifest extends MainManifest, FeatureManifest {
}
export declare function readManifest(packageManifest: Record<string, unknown>): Promise<Manifest>;
