package coop.polypoly.core

import org.msgpack.value.Value

enum class PlatformRequest {
    Example;

    companion object {
        // TODO: Investigate the option of doing automatic decoding
        fun fromValue(value: Value): PlatformRequest {
            // TODO: This only handles the simple case where a string from core
            // But a map might be sent, for example: PlatformRequest.Example(String)
            // This needs to become more robust.
            val request = value.asStringValue().toString()
            return PlatformRequest.valueOf(request)
        }
    }
}

fun JniApi.handlePlatformRequest(request: PlatformRequest): Value {
    return when (request) {
        PlatformRequest.Example -> "Test".asValue().asOk()
    }
}
