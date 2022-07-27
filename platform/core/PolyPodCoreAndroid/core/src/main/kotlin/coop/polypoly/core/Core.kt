package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value

class Core {
    companion object {
        fun bootstrapCore(languageCode: String) {
            return handleCoreResponse(JniApi().bootstrapCore(languageCode)) {}
        }

        fun loadFeatureCategories(featuresDir: String): List<FeatureCategory> {
            return handleCoreResponse(
                JniApi().loadFeatureCategories(featuresDir)
            ) { mapFeatureCategories(it) }
        }

        fun execRdfQuery(query: String): QueryResult {
            return handleCoreResponse(
                JniApi().execRdfQuery(query)
            ) { mapQueryResult(it)}
        }

        fun execRdfUpdate(query: String) {
            return handleCoreResponse(
                JniApi().execRdfUpdate(query)
            ) {}
        }

        private fun <T> handleCoreResponse(
            byteResponse: ByteArray,
            map: (Value) -> T
        ): T {
            val unpacker: MessageUnpacker =
                MessagePack.newDefaultUnpacker(byteResponse)
            val responseObject = unpacker.unpackValue().asMapValue().map()

            responseObject.get("Ok")?.also {
                return map(it)
            }

            responseObject.get("Err")?.also {
                throw mapError(it.asMapValue().map())
            }

            throw InvalidCoreResponseFormat(responseObject.toString())
        }
    }
}
