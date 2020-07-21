/**
 * Additional DOM properties and events that a Feature may assume.
 *
 * Pod implementations are responsible for defining those properties accordingly.
 *
 * @packageDocumentation
 */

import { Pod } from "./api";

/**
 * Custom event that signals availability of the [[Pod]] API. See [[Pod]] for details.
 *
 * This event is only triggered once. When it is triggered, a working API is available through `event.detail`
 * or `window.pod`. TypeScript users may prefer the former since it is guaranteed to be defined.
 */
export interface PodReadyEvent extends CustomEvent<Pod> {
    readonly target: Window;
    readonly type: "podReady";
}

declare global {
    interface Window {
        pod?: Pod;
    }

    interface WindowEventMap {
        podReady: PodReadyEvent;
    }
}
