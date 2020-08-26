package eu.polypoly.pod.android.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

// definitely not sure if that is a good idea, I'll find that out
sealed class QuadSubject {

    companion object {
        val codec: Codec<QuadSubject> =
            Codec.id
                .xmap(
                    {
                        try {
                            val iri = IRI.codec.decode(it)
                            IRISubject(iri)
                        } catch (e: Exception) {
                            val blankNode = BlankNode.codec.decode(it)
                            BlankNodeSubject(blankNode)
                        }
                    },
                    {
                        when (it) {
                            is IRISubject -> IRI.codec.encode(it.subject)
                            is BlankNodeSubject -> BlankNode.codec.encode(it.subject)
                        }
                    }
                )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false
        return true
    }

    override fun hashCode(): Int {
        return javaClass.hashCode()
    }
}

data class IRISubject(val subject: IRI) : QuadSubject()
data class BlankNodeSubject(val subject: BlankNode) : QuadSubject()
