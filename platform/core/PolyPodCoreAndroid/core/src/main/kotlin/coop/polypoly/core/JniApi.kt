package coop.polypoly.core

class JniApi {
    init {
        System.loadLibrary("polypod_core")
    }

    external fun bootstrapCore(languageCode: String): ByteArray
    external fun execRdfQuery(query: String, appPath: String): ByteArray
    external fun execRdfUpdate(query: String, appPath: String): ByteArray
    external fun loadFeatureCategories(featuresDir: String): ByteArray
}
