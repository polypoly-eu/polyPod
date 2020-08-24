package eu.polypoly.pod.android.polyIn.bubblewrap

import eu.polypoly.bubblewrap.Codec
import eu.polypoly.pod.android.logging.LoggerFactory
import eu.polypoly.pod.android.polyIn.IRI
import org.msgpack.core.MessagePack
import org.msgpack.value.ExtensionValue
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory.*
import java.io.ByteArrayOutputStream

class IRICodec : Codec<IRI> {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    override fun encode(iri: IRI?): Value {
        if (iri == null)
            return newNil()
        val valueArray = newArray(newString("value"), newString(iri.iri))
        val termTypeArray = newArray(newString("termType"), newString("NamedNode"))
        val objArray = newArray(valueArray, termTypeArray)
        val value = newArray(newString("@polypoly-eu/rdf.NamedNode"), objArray)
        return wrapAsExtensionValue(value)
    }

    override fun decode(v: Value): IRI? {
        if (v.isNilValue)
            return null
        if (!v.isExtensionValue || v.asExtensionValue().type != 2.toByte())
            throw IllegalArgumentException("Expected ExtensionValue of type '2', got '${v.valueType}'")
        val value = MessagePack.newDefaultUnpacker(v.asExtensionValue().data).unpackValue()
        if (!value.isArrayValue)
            throw IllegalArgumentException("Malformed @polypoly-eu/rdf.NamedNode, expected ArrayValue, got '${v.valueType}'")
        val vArray = value.asArrayValue()
        if (vArray.size() != 2)
            throw IllegalArgumentException("Malformed @polypoly-eu/rdf.NamedNode, expected ArrayValue to have 2 elements, got '${vArray.size()}'")

        if (!vArray[0].isStringValue || vArray[0].toString() != "@polypoly-eu/rdf.NamedNode")
            throw IllegalArgumentException("Expected type '@polypoly-eu/rdf.NamedNode', got '${vArray[0]}'")
        // no need of further processing of vArray[0]
        if (!vArray[1].isArrayValue)
            throw IllegalArgumentException("Malformed object, expected ArrayValue, got '${vArray[1].valueType}'")
        val objArray = vArray[1].asArrayValue()
        if (objArray.size() != 2)
            throw IllegalArgumentException("Malformed object, expected ArrayValue to have 2 elements, got '${objArray.size()}'")
        if (!objArray[0].isArrayValue)
            throw IllegalArgumentException("Malformed value, expected ArrayValue, got '${objArray[0].valueType}'")
        if (!objArray[1].isArrayValue)
            throw IllegalArgumentException("Malformed termType, expected ArrayValue, got '${objArray[1].valueType}'")
        val firstArray = objArray[0].asArrayValue()
        val (valueArray, termTypeArray) = if (firstArray[0].isStringValue && firstArray[0].asStringValue().toString() == "value") {
            Pair(objArray[0].asArrayValue(), objArray[1].asArrayValue())
        } else {
            Pair(objArray[1].asArrayValue(), objArray[0].asArrayValue())
        }
        if (!termTypeArray[0].isStringValue || termTypeArray[0].toString() != "termType")
            throw IllegalArgumentException("Expected field 'termType', got '${termTypeArray[0]}'")
        if (!termTypeArray[1].isStringValue || termTypeArray[1].toString() != "NamedNode")
        // redundant data so redundant check
            throw IllegalArgumentException("Expected termType to be 'NamedNode', got '${termTypeArray[1]}'")

        if (!valueArray[0].isStringValue || valueArray[0].toString() != "value")
            throw IllegalArgumentException("Expected field 'value', got '${valueArray[0]}'")
        if (!valueArray[1].isStringValue)
            throw IllegalArgumentException("Expected value to be a string, got '${valueArray[1].valueType}'")
        // ...and finally... drum roll ...
        return IRI(valueArray[1].asStringValue().toString())
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
