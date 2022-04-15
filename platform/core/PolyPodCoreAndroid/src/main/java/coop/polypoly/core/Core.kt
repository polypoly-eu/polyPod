package coop.polypoly.core

import java.nio.ByteBuffer

class Core {
    companion object {
        fun bootstrapCore(languageCode: String) {
            val response = JniApi().bootstrapCore(languageCode)
            val result = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(
                ByteBuffer.wrap(response))

            val response2 = JniApi().bootstrapCore(languageCode)
            val result2 = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(
                ByteBuffer.wrap(response2))
        }

        fun parseFeatureManifest(json: String) {
            val response = JniApi().parseFeatureManifest(json)
            val result = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(
                ByteBuffer.wrap(response))
        }
    }
}
