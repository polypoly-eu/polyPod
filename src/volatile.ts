import {Pod, PolyIn, PolyOut} from "@polypoly-eu/poly-api";
import {bindFS} from "./util";

export class VolatilePod implements Pod {

    constructor(
        public pod: Pod,
    ) {}

    get polyIn(): PolyIn {
        return {
            factory: this.pod.polyIn.factory,
            select: matcher => this.pod.polyIn.select(matcher),
            add: (...quads) => this.pod.polyIn.add(...quads)
        };
    }

    get polyOut(): PolyOut {
        return {
            fetch: (input, init) => this.pod.polyOut.fetch(input, init),
            ...bindFS(this.pod.polyOut)
        };
    }

}
