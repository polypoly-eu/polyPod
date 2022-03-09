package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory.newMap
import org.msgpack.value.ValueFactory.newString

sealed class QuadGraph {

    companion object {
        val codec: Codec<QuadGraph> =
            Codec.id
                .xmap(
                    {
                        try {
                            val iri = IRI.codec.decode(it)
                            IRIGraph(iri)
                        } catch (e: Exception) {
                            try {
                                val value = BlankNode.codec.decode(it)
                                BlankNodeGraph(value)
                            } catch (e: Exception) {
                                DefaultGraph
                            }
                        }
                    },
                    {
                        when (it) {
                            is IRIGraph -> IRI.codec.encode(it.graph)
                            is BlankNodeGraph ->
                                BlankNode.codec.encode(it.graph)
                            DefaultGraph -> DefaultGraph.msgPackValue
                        }
                    }
                )
    }
}

data class IRIGraph(val graph: IRI) : QuadGraph()
data class BlankNodeGraph(val graph: BlankNode) : QuadGraph()
object DefaultGraph : QuadGraph() {
    val msgPackValue: Value = newMap(
        mapOf(
            Pair(newString("value"), newString("")),
            Pair(newString("termType"), newString("DefaultGraph"))
        )
    )
}
