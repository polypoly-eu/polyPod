package coop.polypoly.polypod.polyIn

import coop.polypoly.polypod.polyIn.rdf.Matcher
import coop.polypoly.polypod.polyIn.rdf.Quad

open class PolyIn {
    open suspend fun select(matcher: Matcher): List<Quad> {
        TODO("Implement me!")
    }

    open suspend fun add(quads: List<Quad>) {
        TODO("Implement me!")
    }
}
