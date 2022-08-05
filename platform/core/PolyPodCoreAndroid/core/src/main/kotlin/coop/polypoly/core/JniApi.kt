package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

enum class NativeRequest {
    Example
}

sealed interface NativeResponse {
    fun messageValue(): Value
}

object Example : NativeResponse {
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

    private fun mapToNativeRequest(request: String): NativeRequest {
        return NativeRequest.valueOf(request)
    }

    private fun handle(nativeRequest: NativeRequest): NativeResponse {
        when (nativeRequest) {
            NativeRequest.Example -> return Example
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
            val request = unpacker.unpackValue().asStringValue().toString()
            val nativeRequest = mapToNativeRequest(request)
            val response = handle(nativeRequest)
            pack(response.messageValue(), true)
        } catch (exp: Exception) {
            pack(ValueFactory.newString(exp.toString()), false)
        }
    }

    external fun bootstrapCore(languageCode: String, callback: JniApi): ByteArray // ktlint-disable max-line-length
    external fun loadFeatureCategories(featuresDir: String): ByteArray
}
