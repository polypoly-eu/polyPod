package eu.polypoly.pod.android

import eu.polypoly.pod.android.polyOut.PolyOutTestDouble

class PodApiTestDouble(override val polyOut: PolyOutTestDouble) : PodApi(polyOut) {
    fun reset() {
        polyOut.reset()
    }
}
