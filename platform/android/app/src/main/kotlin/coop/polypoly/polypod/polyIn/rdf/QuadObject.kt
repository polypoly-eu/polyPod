package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec
import org.msgpack.core.MessagePack

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
                            // not an IRI
                            try {
                                val literal = Literal.codec.decode(it)
                                LiteralObject(literal)
                            } catch (e: Exception) {
                                // not a literal
                                try {
                                    val blankNode = BlankNode.codec.decode(it)
                                    BlankNodeObject(blankNode)
                                } catch (e: Exception) {
                                    // not a blank node
                                    // TODO - a lot of assumptions about
                                    //  structure - throw a meaningful
                                    //  exception when it doesn't match
                                    val unpacker = MessagePack
                                        .newDefaultUnpacker(
                                            it.asExtensionValue().data
                                        )
                                    val arr = unpacker
                                        .unpackValue().asArrayValue()
                                    val type = arr[0].asStringValue().toString()
                                    throw IllegalArgumentException(
                                        "Unsupported type for object: $type"
                                    )
                                }
                            }
                        }
                    },
                    {
                        when (it) {
                            is IRIObject -> IRI.codec.encode(it.`object`)
                            is BlankNodeObject
                            -> BlankNode.codec.encode(it.`object`)
                            is LiteralObject
                            -> Literal.codec.encode(it.`object`)
                        }
                    }
                )
    }
}

data class IRIObject(val `object`: IRI) : QuadObject()
data class BlankNodeObject(val `object`: BlankNode) : QuadObject()
data class LiteralObject(val `object`: Literal) : QuadObject()
