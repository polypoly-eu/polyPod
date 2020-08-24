package eu.polypoly.pod.android.polyIn

class PolyInTestDouble : PolyIn() {
    var addWasCalled = false
    var addParams: List<RdfQuad>? = null

    fun reset() {
        addWasCalled = false
        addParams = null
    }

    override suspend fun add(quads: List<RdfQuad>) {
        addWasCalled = true
        addParams = quads
    }
}
