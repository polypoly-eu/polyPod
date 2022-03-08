package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec
import org.msgpack.value.ValueFactory

const val STRING_DATATYPE = "http://www.w3.org/2001/XMLSchema#string"

data class Literal(
    val value: String,
    val dataType: IRI = IRI(STRING_DATATYPE),
    val language: String? = ""
) {

    init {
        if (dataType.iri == STRING_DATATYPE && language == null)
            throw IllegalStateException(
                "Language must not be empty for strings"
            )
        if (dataType.iri != STRING_DATATYPE && language != null)
            throw IllegalStateException(
                "Language must not be set for types other than string"
            )
    }

    companion object {
        val codec: Codec<Literal> =
            Codec.kvArray(Codec.string, Codec.id)
                .xmap(
                    {
                        val value =
                            it["value"] ?: throw IllegalArgumentException(
                                "Expected value"
                            )
                        val termTypeValue =
                            it["termType"] ?: throw IllegalArgumentException(
                                "Expected termType"
                            )
                        if (
                            termTypeValue.asStringValue().toString()
                            != "Literal"
                        )
                            throw IllegalArgumentException(
                                "Expected termType to be 'Literal'"
                            )
                        val datatypeValue =
                            it["datatype"] ?: throw IllegalArgumentException(
                                "Expected datatype element"
                            )
                        val datatype = IRI.codec.decode(datatypeValue)
                        val language = if (datatype.iri == STRING_DATATYPE) {
                            val languageValue =
                                it["language"] ?: throw
                                IllegalArgumentException(
                                    "For strings language is mandatory"
                                )
                            languageValue.asStringValue().toString()
                        } else {
                            null
                        }
                        Literal(
                            value.asStringValue().toString(),
                            datatype,
                            language
                        )
                    },
                    {
                        val map = mapOf(
                            Pair("value", ValueFactory.newString(it.value)),
                            Pair(
                                "termType",
                                ValueFactory.newString("Literal")
                            ),
                            Pair("datatype", IRI.codec.encode(it.dataType))
                        ).toMutableMap()
                        if (it.dataType.iri == STRING_DATATYPE) {
                            map["language"] =
                                ValueFactory.newString(it.language)
                        }
                        map
                    }
                )
                .taggedClass("@polypoly-eu/rdf.Literal")
    }
}
