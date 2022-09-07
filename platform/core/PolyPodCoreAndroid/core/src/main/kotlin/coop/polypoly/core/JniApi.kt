package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

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

object JniApi {
    external fun bootstrapCore(
        languageCode: String,
        fsRoot: String,
        callback: JniApi
    ): ByteArray
    external fun loadFeatureCategories(args: ByteArray): ByteArray
    external fun execRdfQuery(query: String): ByteArray
    external fun execRdfUpdate(query: String): ByteArray
    external fun appDidBecomeInactive(): ByteArray
    external fun isUserSessionExpired(): ByteArray
    external fun setUserSessionTimeoutOption(option: ByteArray): ByteArray
    external fun getUserSessionTimeoutOption(): ByteArray
    external fun getUserSessionTimeoutOptionsConfig(): ByteArray

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

    fun performRequest(input: ByteArray): ByteArray {
        return try {
            val unpacker: MessageUnpacker = MessagePack.newDefaultUnpacker(
                input
            )
            val platformRequest = mapToPlatformRequest(unpacker.unpackValue())
            val response = handle(platformRequest)
            response.messageValue().asOk().pack()
        } catch (exp: Exception) {
            exp.asValue().asErr().pack()
        }
    }
}
