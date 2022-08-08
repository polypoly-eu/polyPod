package coop.polypoly.core

class JniApi {
    init {
        System.loadLibrary("polypod_core")
    }

    external fun bootstrapCore(languageCode: String, fsRoot: String): ByteArray
    external fun loadFeatureCategories(featuresDir: String): ByteArray
}
