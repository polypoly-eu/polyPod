package eu.polypoly.pod.android.polyIn

import eu.polypoly.pod.android.polyIn.rdf.Matcher
import eu.polypoly.pod.android.polyIn.rdf.Quad

class PolyInTestDouble : PolyIn() {
    var selectWasCalled = false
    var selectMatcher: Matcher? = null
    var selectReturn: List<Quad>? = null
    var addWasCalled = false
    var addParams: List<Quad>? = null

    fun reset() {
        addWasCalled = false
        addParams = null
    }

    override suspend fun select(matcher: Matcher): List<Quad> {
        selectWasCalled = true
        selectMatcher = matcher
        return selectReturn ?: emptyList()
    }

    override suspend fun add(quads: List<Quad>) {
        addWasCalled = true
        addParams = quads
    }
}
