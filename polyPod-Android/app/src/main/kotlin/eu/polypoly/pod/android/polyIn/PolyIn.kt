package eu.polypoly.pod.android.polyIn

import eu.polypoly.pod.android.polyIn.rdf.Matcher
import eu.polypoly.pod.android.polyIn.rdf.Quad

open class PolyIn {
    open suspend fun select(matcher: Matcher): List<Quad> {
        TODO("Implement me!")
    }

    open suspend fun add(quads: List<Quad>) {
        TODO("Implement me!")
    }
}
