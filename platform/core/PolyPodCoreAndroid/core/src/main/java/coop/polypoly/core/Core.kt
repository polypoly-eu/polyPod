package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.value.ValueFactory
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value

class Core {
    companion object {
        fun bootstrapCore(languageCode: String) {
            return handleCoreResponse(JniApi().bootstrapCore(languageCode)) {}
        }

        fun parseFeatureManifest(json: String): FeatureManifest {
            return handleCoreResponse(JniApi().parseFeatureManifest(json))  { mapFeatureManifest(it) }
        }

        private fun <T> handleCoreResponse(
            byteResponse: ByteArray,
            map: (Value) -> T): T {
            val unpacker: MessageUnpacker =
                MessagePack.newDefaultUnpacker(byteResponse)
            val responseObject = unpacker.unpackValue().asMapValue().map()

            responseObject[ValueFactory.newString("Ok")]?.also {
                return map(it)
            }

            responseObject[ValueFactory.newString("Err")]?.also {
                throw mapError(it.asMapValue().map())
            }

            throw InvalidCoreResponseFormat()
        }
    }
}
