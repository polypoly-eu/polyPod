package coop.polypoly.polypod

import coop.polypoly.polypod.polyIn.PolyInTestDouble
import coop.polypoly.polypod.polyOut.PolyOutTestDouble

class PodApiTestDouble(
    override val polyOut: PolyOutTestDouble,
    override val polyIn: PolyInTestDouble
): PodApi(polyOut, polyIn) {
    fun reset() {
        polyOut.reset()
        polyIn.reset()
    }
}
