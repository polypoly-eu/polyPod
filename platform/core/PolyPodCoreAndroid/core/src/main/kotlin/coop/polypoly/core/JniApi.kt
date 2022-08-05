package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

enum class NativeRequest {
    FeatureName
}

sealed interface NativeResponse<T> {
    fun response(): T
    fun messagePackedAsOk(): ByteArray
}

object FeatureName : NativeResponse<String> {
    override fun response(): String {
        return "Test"
    }

    override fun messagePackedAsOk(): ByteArray {
        val map = ValueFactory.newMap(
            mutableMapOf(
                ValueFactory.newString("Ok") to ValueFactory.newMap(
                    mutableMapOf(
                        ValueFactory.newString(
                            "FeatureName"
                        ) to ValueFactory.newString(
                            response()
                        )
                    )
                )
            )
        )
        val output = ByteArrayOutputStream()
        val packer = MessagePack.newDefaultPacker(output)
        packer.packValue(map)
        packer.close()
        return output.toByteArray()
    }
}

class JniApi {
    init {
        System.loadLibrary("polypod_core")
    }

    private fun mapToNativeRequest(request: String): NativeRequest {
        return NativeRequest.valueOf(request)
    }

    private fun handle(nativeRequest: NativeRequest): NativeResponse<Any> {
        when (nativeRequest) {
            NativeRequest.FeatureName -> return FeatureName as NativeResponse<Any> // ktlint-disable max-line-length
        }
    }

    private fun packExp(exception: Exception): ByteArray {
        val map = ValueFactory.newMap(
            mutableMapOf(
                ValueFactory.newString("Err") to ValueFactory.newString(
                    exception.toString()
                )
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
            response.messagePackedAsOk()
        } catch (exp: Exception) {
            packExp(exp)
        }
    }

    external fun bootstrapCore(languageCode: String, callback: JniApi): ByteArray // ktlint-disable max-line-length
    external fun loadFeatureCategories(featuresDir: String): ByteArray
}
