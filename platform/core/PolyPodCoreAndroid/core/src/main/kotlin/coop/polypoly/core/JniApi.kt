package coop.polypoly.core

class JniApi {
    init {
        System.loadLibrary("polypod_core")
    }

    external fun bootstrapCore(languageCode: String): ByteArray
    external fun parseFeatureManifest(json: String): ByteArray
    external fun execRdfQuery(query: String): ByteArray
    external fun execRdfUpdate(query: String): ByteArray
}
