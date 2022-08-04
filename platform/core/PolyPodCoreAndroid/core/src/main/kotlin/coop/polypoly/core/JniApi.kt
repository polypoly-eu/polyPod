package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.ValueFactory
import java.io.ByteArrayOutputStream

enum class NativeRequest {
    FeatureName
}

enum class NativeResponse(String: String.Companion) {
    FeatureName(String)
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
            NativeRequest.FeatureName -> return NativeResponse.FeatureName
        }
    }

    // TODO: Find the right format for NativeResponse. An enum does not work like it does in swift.
    private fun packOk(response: NativeResponse): ByteArray {
//        val map = ValueFactory.newMap(
//            mutableMapOf(
//                ValueFactory.newString("Ok") to ValueFactory.newMap(
//                    mutableMapOf(
//                        ValueFactory.newString("FeatureName") to ValueFactory.newString( // ktlint-disable max-line-length
//                            "Test"
//                        )
//                    )
//                )
//            )
//        )
        val output = ByteArrayOutputStream()
        val packer = MessagePack.newDefaultPacker(output)
//        packer.packValue(map)
        packer.packValue(ValueFactory.newString("Test"))
        return output.toByteArray()
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
            packOk(response)
        } catch (exp: Exception) {
            packExp(exp)
        }
    }

    external fun bootstrapCore(languageCode: String, callback: JniApi): ByteArray // ktlint-disable max-line-length
    external fun loadFeatureCategories(featuresDir: String): ByteArray
}
