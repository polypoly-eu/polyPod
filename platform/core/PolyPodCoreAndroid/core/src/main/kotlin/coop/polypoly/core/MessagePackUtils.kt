package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

fun Value.getStringValue(): String? {
    if (isNilValue) {
        return null
    }

    return asStringValue().asString()
}

fun Value.getIntValue(): Int? {
    if (isNilValue) {
        return null
    }

    return asIntegerValue().asInt()
}

fun Map<Value, Value>.get(key: String): Value? {
    return this[ValueFactory.newString(key)]
}

fun Map<Value, Value>.getValue(key: String): Value {
    return getValue(ValueFactory.newString(key))
}

fun Boolean.Companion.fromValue(value: Value): Boolean {
    return value.asBooleanValue().boolean
}

fun Value.pack(): ByteArray {
    val output = ByteArrayOutputStream()
    val packer = MessagePack.newDefaultPacker(output)
    packer.packValue(this)
    packer.close()
    return output.toByteArray()
}

fun Value.asOk(): Value {
    return ValueFactory.newMap(
        mapOf(
            ValueFactory.newString("Ok") to this
        )
    )
}

fun Value.asErr(): Value {
    return ValueFactory.newMap(
        mapOf(
            ValueFactory.newString("Err") to this
        )
    )
}

fun Exception.asValue(): Value {
    return this.toString().asValue()
}

fun String.asValue(): Value {
    return ValueFactory.newString(this)
}

fun <K: Value, V: Value>Map<K, V>.asValue(): Value {
    return ValueFactory.newMap(this)
}

fun <E: Value>List<E>.asValue(): Value {
    return ValueFactory.newArray(this)
}
