package eu.polypoly.pod.android.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

data class Quad(
    val subject: IRI,    // or BlankNode
    val predicate: IRI,
    val `object`: IRI,    // or Literal or BlankNode
    val graph: IRI  // or BlankNode or constant DefaultGraph
) {

    companion object {
        val codec: Codec<Quad> =
            Codec.kvArray(Codec.string, Codec.id)
                .xmap(
                    {
                        val subject = it["subject"] ?: throw IllegalArgumentException("Expected subject")
                        val predicate = it["predicate"] ?: throw IllegalArgumentException("Expected predicate")
                        val `object` = it["object"] ?: throw IllegalArgumentException("Expected object")
                        val graph = it["graph"] ?: throw IllegalArgumentException("Expected graph")
                        Quad(
                            IRI.codec.decode(subject),
                            IRI.codec.decode(predicate),
                            IRI.codec.decode(`object`),
                            IRI.codec.decode(graph)
                        )
                    },
                    {
                        mapOf(
                            Pair("subject", IRI.codec.encode(it.subject)),
                            Pair("predicate", IRI.codec.encode(it.predicate)),
                            Pair("object", IRI.codec.encode(it.`object`)),
                            Pair("graph", IRI.codec.encode(it.graph)),
                        )
                    }
                )
                .taggedClass("@polypoly-eu/rdf.Quad")
    }

}
