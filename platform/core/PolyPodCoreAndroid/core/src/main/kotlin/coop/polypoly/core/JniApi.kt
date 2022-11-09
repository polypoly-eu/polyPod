package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker

object JniApi {
    external fun bootstrapCore(
        args: ByteArray,
        callback: JniApi
    ): ByteArray
    external fun executeRequest(request: ByteArray): ByteArray

    init {
        System.loadLibrary("polypod_core")
    }

    fun performRequest(input: ByteArray): ByteArray {
        return try {
            val unpacker: MessageUnpacker = MessagePack.newDefaultUnpacker(
                input
            )
            val platformRequest =
                PlatformRequest.fromValue(unpacker.unpackValue())
            return handlePlatformRequest(platformRequest).pack()
        } catch (exp: Exception) {
            exp.asValue().asErr().pack()
        }
    }
}
