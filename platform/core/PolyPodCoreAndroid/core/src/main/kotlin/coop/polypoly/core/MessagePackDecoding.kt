package coop.polypoly.core

import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

fun Value.getStringValue(): String? {
    if (isNilValue) {
        return null
    }

    return asStringValue().asString()
}

fun Value.getMapValue(): Map<Value, Value>? {
    if (isNilValue) {
        return null
    }

    return asMapValue().map()
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
