package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value

object JniApiSingleton {
    val value: JniApi = JniApi()
}
class Core {
    companion object {
        fun bootstrapCore(languageCode: String, fsRoot: String) {
            return handleCoreResponse(
                JniApiSingleton.value.bootstrapCore(
                    languageCode,
                    fsRoot,
                    JniApiSingleton.value
                )
            ) {}
        }

        fun loadFeatureCategories(featuresDir: String): List<FeatureCategory> {
            return handleCoreResponse(
                JniApiSingleton.value.loadFeatureCategories(featuresDir)
            ) { mapFeatureCategories(it) }
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
