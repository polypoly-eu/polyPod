package eu.polypoly.pod.android.polyIn.rdf

import eu.polypoly.bubblewrap.Codec
import org.msgpack.value.ValueFactory

data class Literal(val value: String, val dataType: IRI = IRI("http://www.w3.org/2001/XMLSchema#string")) {

    companion object {
        val codec: Codec<Literal> =
            Codec.kvArray(Codec.string, Codec.id)
                .xmap(
                    {
                        val value = it["value"] ?: throw IllegalArgumentException("Expected value")
                        val termType = it["termType"] ?: throw IllegalArgumentException("Expected termType")
                        if (termType.asStringValue().toString() != "Literal")
                            throw IllegalArgumentException("Expected termType to be 'Literal'")
                        val datatype = it["datatype"]
                        if (datatype != null) {
                            Literal(value.asStringValue().toString(), IRI.codec.decode(datatype))
                        } else {
                            Literal(value.asStringValue().toString())
                        }
                    },
                    { mapOf(
                        Pair("value", ValueFactory.newString(it.value)),
                        Pair("termType", ValueFactory.newString("Literal")),
                        Pair("datatype", IRI.codec.encode(it.dataType))
                    ) }
                )
                .taggedClass("@polypoly-eu/rdf.Literal")
    }
}
