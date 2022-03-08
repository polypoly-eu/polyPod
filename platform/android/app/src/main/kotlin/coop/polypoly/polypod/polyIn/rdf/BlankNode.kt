package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec

data class BlankNode(val value: String) {

    companion object {
        val codec: Codec<BlankNode> =
            Codec.kvArray(Codec.string, Codec.string)
                .xmap(
                    {
                        val value =
                            it["value"] ?: throw
                            IllegalArgumentException("Expected value")
                        BlankNode(value)
                    },
                    {
                        mapOf(
                            Pair("value", it.value),
                            Pair("termType", "BlankNode")
                        )
                    }
                )
                .taggedClass("@polypoly-eu/rdf.BlankNode")
    }
}
