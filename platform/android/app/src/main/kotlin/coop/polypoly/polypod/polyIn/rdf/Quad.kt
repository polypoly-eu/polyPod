package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

data class Quad(
    val subject: QuadSubject, // IRI or BlankNode
    val predicate: IRI,
    val `object`: QuadObject, // IRI or Literal or BlankNode
    val graph: QuadGraph // IRI or BlankNode or constant DefaultGraph
) {

    companion object {
        val codec: Codec<Quad> =
            Codec.kvArray(Codec.string, Codec.id)
                .xmap(
                    {
                        val subject =
                            it["subject"] ?: throw
                            IllegalArgumentException("Expected subject")
                        val predicate =
                            it["predicate"] ?: throw
                            IllegalArgumentException("Expected predicate")
                        val `object` =
                            it["object"] ?: throw
                            IllegalArgumentException("Expected object")
                        val graph =
                            it["graph"] ?: throw
                            IllegalArgumentException("Expected graph")
                        Quad(
                            QuadSubject.codec.decode(subject),
                            IRI.codec.decode(predicate),
                            QuadObject.codec.decode(`object`),
                            QuadGraph.codec.decode(graph)
                        )
                    },
                    {
                        mapOf(
                            Pair(
                                "subject",
                                QuadSubject.codec.encode(it.subject)
                            ),
                            Pair("predicate", IRI.codec.encode(it.predicate)),
                            Pair(
                                "object",
                                QuadObject.codec.encode(it.`object`)
                            ),
                            Pair("graph", QuadGraph.codec.encode(it.graph)),
                        )
                    }
                )
                .taggedClass("@polypoly-eu/rdf.Quad")

        val builder = QuadBuilder
    }
}

class QuadBuilder {
    companion object {
        fun new(): QuadBuilder {
            return QuadBuilder()
        }
    }

    var subject: QuadSubject? = null
    var predicate: IRI? = null
    var `object`: QuadObject? = null
    var graph: QuadGraph? = null

    fun withSubject(subject: IRI): QuadBuilder {
        this.subject = IRISubject(subject)
        return this
    }

    fun withSubject(subject: BlankNode): QuadBuilder {
        this.subject = BlankNodeSubject(subject)
        return this
    }

    fun withPredicate(predicate: IRI): QuadBuilder {
        this.predicate = predicate
        return this
    }

    fun withObject(`object`: IRI): QuadBuilder {
        this.`object` = IRIObject(`object`)
        return this
    }

    fun withObject(`object`: BlankNode): QuadBuilder {
        this.`object` = BlankNodeObject(`object`)
        return this
    }

    fun withObject(`object`: Literal): QuadBuilder {
        this.`object` = LiteralObject(`object`)
        return this
    }

    fun withGraph(graph: IRI): QuadBuilder {
        this.graph = IRIGraph(graph)
        return this
    }

    fun withGraph(graph: BlankNode): QuadBuilder {
        this.graph = BlankNodeGraph(graph)
        return this
    }

    fun withDefaultGraph(): QuadBuilder {
        this.graph = DefaultGraph
        return this
    }

    fun build(): Quad {
        return Quad(subject!!, predicate!!, `object`!!, graph!!)
    }
}
