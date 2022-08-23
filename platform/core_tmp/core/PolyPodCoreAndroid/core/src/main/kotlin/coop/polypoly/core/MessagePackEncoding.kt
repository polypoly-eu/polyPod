package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

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
    return ValueFactory.newString(this.toString())
}
