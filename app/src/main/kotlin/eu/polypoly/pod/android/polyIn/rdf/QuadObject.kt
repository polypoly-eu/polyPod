package eu.polypoly.pod.android.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

sealed class QuadObject {

    companion object {
        val codec: Codec<QuadObject> =
            Codec.id
                .xmap(
                    {
                        try {
                            val iri = IRI.codec.decode(it)
                            IRIObject(iri)
                        } catch (e: Exception) {
                            val blankNode = BlankNode.codec.decode(it)
                            BlankNodeObject(blankNode)
                        }
                    },
                    {
                        when (it) {
                            is IRIObject -> IRI.codec.encode(it.`object`)
                            is BlankNodeObject -> BlankNode.codec.encode(it.`object`)
                        }
                    }
                )
    }

}

data class IRIObject(val `object`: IRI) : QuadObject()
data class BlankNodeObject(val `object`: BlankNode) : QuadObject()
