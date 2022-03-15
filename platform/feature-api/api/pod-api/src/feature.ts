/**
 * Additional DOM properties that a Feature may assume.
 *
 * Pod implementations are responsible for defining those properties accordingly.
 *
 * @packageDocumentation
 */

import { Pod } from "./api";

declare global {
    interface Window {
        pod: Pod;
    }
}
