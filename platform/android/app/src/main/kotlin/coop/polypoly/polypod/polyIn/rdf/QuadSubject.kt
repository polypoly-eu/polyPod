package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

// definitely not sure if that is a good idea, I'll find that out
sealed class QuadSubject {

    companion object {
        val codec: Codec<QuadSubject> =
            Codec.choice(
                Codec.Choice(
                    IRISubject::class.java,
                    IRI.codec.xmap({ IRISubject(it) }, { it.subject })
                ),
                Codec.Choice(
                    BlankNodeSubject::class.java,
                    BlankNode.codec.xmap(
                        { BlankNodeSubject(it) },
                        { it.subject }
                    )
                )
            )
    }
}

data class IRISubject(val subject: IRI) : QuadSubject()
data class BlankNodeSubject(val subject: BlankNode) : QuadSubject()
