import {configs} from "./build/rollup-common";

export default [
    configs.bootstrap,
    configs.cli,
    configs.reactGlobal,
    configs.reactDomGlobal
];
