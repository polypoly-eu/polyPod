package eu.polypoly.pod.android.polyIn.bubblewrap

import eu.polypoly.bubblewrap.Codec
import eu.polypoly.pod.android.logging.LoggerFactory
import eu.polypoly.pod.android.polyIn.RdfQuad
import org.msgpack.core.MessagePack
import org.msgpack.value.ExtensionValue
import org.msgpack.value.StringValue
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory.*
import java.io.ByteArrayOutputStream

class RdfQuadCodec : Codec<RdfQuad> {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    val iriCodec = IRICodec()

    override fun encode(quad: RdfQuad): Value {
        logger.debug("RdfQuadCodec.encode(), quad: '{}'", quad)
        val subject = iriCodec.encode(quad.subject)
        val predicate = iriCodec.encode(quad.predicate)
        val `object` = iriCodec.encode(quad.`object`)
        val graph = iriCodec.encode(quad.graph)
        val objArray = newArray(subject, predicate, `object`, graph)
        val value = newArray(newString("@polypoly-eu/rdf.Quad"), objArray)
        return wrapAsExtensionValue(value)
    }

    override fun decode(v: Value): RdfQuad {
        logger.debug("RdfQuadCodec.decode(), v: '{}'", v.toJson())
        if (!v.isExtensionValue || v.asExtensionValue().type != 2.toByte())
            throw IllegalArgumentException("Expected ExtensionValue of type '2', got '${v.valueType}'")
        val arg = v.asExtensionValue()
        val unpacker = MessagePack.newDefaultUnpacker(arg.data)
        val quadArrayWrapper = unpacker.unpackValue().asArrayValue()
        if ((quadArrayWrapper[0] as StringValue).toString() != "@polypoly-eu/rdf.Quad") {
            throw IllegalArgumentException("Expected type '@polypoly-eu/rdf.Quad', got '${quadArrayWrapper[0]}'")
        }
        val quadArray = quadArrayWrapper[1].asArrayValue()   // why is it an array instead of a map?
        // TODO - the order of properties is not guaranteed!
        val subjectIri = iriCodec.decode(quadArray[0].asArrayValue()[1])
        val predicateIri = iriCodec.decode(quadArray[1].asArrayValue()[1])
        val objectIri = iriCodec.decode(quadArray[2].asArrayValue()[1])
        val graphIri = iriCodec.decode(quadArray[3].asArrayValue()[1])
        return RdfQuad(subjectIri!!, predicateIri!!, objectIri!!, graphIri!!)
    }

    private fun wrapAsExtensionValue(v: Value): ExtensionValue {
        val baos = ByteArrayOutputStream()
        val packer = MessagePack.newDefaultPacker(baos)
        packer.packValue(v)
        packer.flush()
        val bytes = baos.toByteArray()
        return newExtension(2, bytes)
    }
}
