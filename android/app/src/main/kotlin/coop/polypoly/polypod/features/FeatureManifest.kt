package coop.polypoly.polypod.features

import com.google.gson.Gson
import org.slf4j.LoggerFactory

class FeatureManifest (
    private val manifestString: String
) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val gson: Gson = Gson()

    fun getManifest(): ManifestModel {
        return gson.fromJson<ManifestModel>(
            this.manifestString, ManifestModel::class.java
        )
    }
}
