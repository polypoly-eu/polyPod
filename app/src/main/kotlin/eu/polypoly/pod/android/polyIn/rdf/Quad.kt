package eu.polypoly.pod.android.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

data class Quad(
    val subject: QuadSubject,    // IRI or BlankNode
    val predicate: IRI,
    val `object`: QuadObject,    // IRI or Literal or BlankNode
    val graph: QuadGraph  // IRI or BlankNode or constant DefaultGraph
) {

    constructor(subject: IRI, predicate: IRI, `object`: IRI, graph: IRI) : this(IRISubject(subject), predicate, IRIObject(`object`), IRIGraph(graph))
    constructor(subject: BlankNode, predicate: IRI, `object`: IRI, graph: IRI) : this(BlankNodeSubject(subject), predicate, IRIObject(`object`), IRIGraph(graph))
    constructor(subject: IRI, predicate: IRI, `object`: BlankNode, graph: IRI) : this(IRISubject(subject), predicate, BlankNodeObject(`object`), IRIGraph(graph))
    constructor(subject: BlankNode, predicate: IRI, `object`: BlankNode, graph: IRI) : this(BlankNodeSubject(subject), predicate, BlankNodeObject(`object`), IRIGraph(graph))
    constructor(subject: IRI, predicate: IRI, `object`: IRI, graph: DefaultGraph) : this(IRISubject(subject), predicate, IRIObject(`object`), graph)

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
                            QuadSubject.codec.decode(subject),
                            IRI.codec.decode(predicate),
                            QuadObject.codec.decode(`object`),
                            QuadGraph.codec.decode(graph)
                        )
                    },
                    {
                        mapOf(
                            Pair("subject", QuadSubject.codec.encode(it.subject)),
                            Pair("predicate", IRI.codec.encode(it.predicate)),
                            Pair("object", QuadObject.codec.encode(it.`object`)),
                            Pair("graph", QuadGraph.codec.encode(it.graph)),
                        )
                    }
                )
                .taggedClass("@polypoly-eu/rdf.Quad")
    }

}
