package coop.polypoly.core

import android.graphics.Color
import org.msgpack.core.MessagePack
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

fun Value.asOptionalString(): String? {
    if (isNilValue) {
        return null
    }

    return asString()
}

fun Value.asOptionalInt(): Int? {
    if (isNilValue) {
        return null
    }

    return asIntegerValue().asInt()
}

fun Value.asString(): String {
    return asStringValue().asString()
}

fun Value.asColor(): Int {
    return Color.parseColor(asString())
}

fun Map<Value, Value>.get(key: String): Value? {
    return this[ValueFactory.newString(key)]
}

fun Map<Value, Value>.getValue(key: String): Value {
    return getValue(ValueFactory.newString(key))
}

fun Map<Value, Value>.getOptionalString(key: String): String? {
    return getValue(key).asOptionalString()
}

fun Map<Value, Value>.getString(key: String): String {
    return getValue(key).asString()
}

fun Map<Value, Value>.getColor(key: String): Int {
    return getValue(key).asColor()
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

fun <K : Value, V : Value> Map<K, V>.asValue(): Value {
    return ValueFactory.newMap(this)
}

fun <E : Value> List<E>.asValue(): Value {
    return ValueFactory.newArray(this)
}
