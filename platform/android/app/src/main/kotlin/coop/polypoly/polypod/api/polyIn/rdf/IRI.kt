package coop.polypoly.polypod.api.polyIn.rdf

import coop.polypoly.polypod.api.bubblewrap.Codec

data class IRI(val iri: String) {

    companion object {
        val codec: Codec<IRI> =
            Codec.kvArray(Codec.string, Codec.string)
                .xmap(
                    {
                        val iri = it["value"]
                            ?: throw IllegalArgumentException("Expected value")
                        IRI(iri)
                    },
                    {
                        mapOf(
                            Pair("value", it.iri),
                            Pair("termType", "NamedNode")
                        )
                    }
                )
                .taggedClass("@polypoly-eu/rdf.NamedNode")
    }
}
