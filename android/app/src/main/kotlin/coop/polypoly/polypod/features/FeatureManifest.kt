package coop.polypoly.polypod.features

import com.google.gson.Gson

class FeatureManifest (
    val name: String,
    val author: String,
    val version: String,
    val description: String,
    val thumbnail: String,
    val primaryColor: String,
    val links: Map<String, String>
) {
    companion object {
        fun parse(manifestString: String): FeatureManifest =
            Gson().fromJson<FeatureManifest>(
                manifestString, FeatureManifest::class.java
            )
    }
}
