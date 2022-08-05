package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

enum class PlatformRequest {
    Example
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

class JniApi {
    init {
        System.loadLibrary("polypod_core")
    }

    private fun mapToPlatformRequest(value: Value): PlatformRequest {
        // TODO: This only handles the simple case where a string from core
        // But a map might be sent, for example: PlatformRequest.Example(String)
        // This needs to become more robust.
        val request = value.asStringValue().toString()
        return PlatformRequest.valueOf(request)
    }

    private fun handle(platformRequest: PlatformRequest): PlatformResponse {
        when (platformRequest) {
            PlatformRequest.Example -> return Example
        }
    }

    private fun pack(value: Value, isOk: Boolean): ByteArray {
        val okOrError = if (isOk) "Ok" else "Err"
        val map =
            ValueFactory.newMap(
                mutableMapOf(
                    ValueFactory.newString(okOrError) to value
                )
            )
        val output = ByteArrayOutputStream()
        val packer = MessagePack.newDefaultPacker(output)
        packer.packValue(map)
        packer.close()
        return output.toByteArray()
    }

    fun performRequest(input: ByteArray): ByteArray {
        return try {
            val unpacker: MessageUnpacker = MessagePack.newDefaultUnpacker(
                input
            )
            val platformRequest = mapToPlatformRequest(unpacker.unpackValue())
            val response = handle(platformRequest)
            pack(response.messageValue(), true)
        } catch (exp: Exception) {
            pack(ValueFactory.newString(exp.toString()), false)
        }
    }

    external fun bootstrapCore(languageCode: String, callback: JniApi): ByteArray // ktlint-disable max-line-length
    external fun loadFeatureCategories(featuresDir: String): ByteArray
}
