package coop.polypoly.polypod.polyIn

import coop.polypoly.polypod.polyIn.rdf.Matcher
import coop.polypoly.polypod.polyIn.rdf.Quad

class PolyInTestDouble : PolyIn(
    context =
    androidx.test.core.app.ApplicationProvider.getApplicationContext()
) {
    var matchWasCalled = false
    var matchMatcher: Matcher? = null
    var matchReturn: List<Quad>? = null
    var addWasCalled = false
    var addParams: List<Quad>? = null

    fun reset() {
        addWasCalled = false
        addParams = null
    }

    override suspend fun match(matcher: Matcher): List<Quad> {
        matchWasCalled = true
        matchMatcher = matcher
        return matchReturn ?: emptyList()
    }

    override suspend fun add(quads: List<Quad>) {
        addWasCalled = true
        addParams = quads
    }
}
