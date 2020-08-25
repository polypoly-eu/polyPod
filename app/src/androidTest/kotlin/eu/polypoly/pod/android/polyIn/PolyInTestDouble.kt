package eu.polypoly.pod.android.polyIn

import eu.polypoly.pod.android.polyIn.rdf.Quad

class PolyInTestDouble : PolyIn() {
    var addWasCalled = false
    var addParams: List<Quad>? = null

    fun reset() {
        addWasCalled = false
        addParams = null
    }

    override suspend fun add(quads: List<Quad>) {
        addWasCalled = true
        addParams = quads
    }
}
