package eu.polypoly.pod.android.polyIn

class PolyInTestDouble : PolyIn() {
    var addWasCalled = false
    var addParams: Array<Any>? = null

    override suspend fun add(quad: RdfQuad?) {
        addWasCalled = true
        addParams = if (quad == null)
            emptyArray()
        else
            arrayOf(quad)
    }
}
