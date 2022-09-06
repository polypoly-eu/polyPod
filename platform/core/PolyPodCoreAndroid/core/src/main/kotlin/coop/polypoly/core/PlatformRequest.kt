package coop.polypoly.core

import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

enum class PlatformRequest {
    Example;

    companion object {
        fun fromValue(value: Value): PlatformRequest {
            // TODO: This only handles the simple case where a string from core
            // But a map might be sent, for example: PlatformRequest.Example(String)
            // This needs to become more robust.
            val request = value.asStringValue().toString()
            return PlatformRequest.valueOf(request)
        }
    }
}

sealed interface PlatformResponse {
    fun messageValue(): Value
}

object Example : PlatformResponse {
    private fun response(): String {
        return "Test"
    }

    override fun messageValue(): Value {
        return ValueFactory.newMap(
            mutableMapOf(
                ValueFactory.newString(
                    "Example"
                ) to ValueFactory.newString(
                    response()
                )
            )
        )
    }
}
