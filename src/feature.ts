import {Pod} from "./api";

export interface PodReadyEvent extends CustomEvent<Pod> {
    readonly target: Window;
    readonly type: "podReady";
}

declare global {
    interface Window {
        pod?: Pod;
    }

    interface WindowEventMap {
        "podReady": PodReadyEvent;
    }
}
