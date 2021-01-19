package eu.polypoly.pod.android

import eu.polypoly.pod.android.polyIn.PolyInTestDouble
import eu.polypoly.pod.android.polyOut.PolyOutTestDouble

class PodApiTestDouble(override val polyOut: PolyOutTestDouble, override val polyIn: PolyInTestDouble) : PodApi(polyOut, polyIn) {
    fun reset() {
        polyOut.reset()
        polyIn.reset()
    }
}
