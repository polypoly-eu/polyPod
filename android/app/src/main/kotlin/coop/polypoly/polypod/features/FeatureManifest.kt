package coop.polypoly.polypod.features

import com.google.gson.Gson

open class FeatureManifest(
    val name: String?,
    val author: String?,
    val version: String?,
    val description: String?,
    val thumbnail: String?,
    val primaryColor: String?,
    val links: Map<String, String>?
) {
    companion object {
        fun parse(
            manifestString: String,
            language: String? = null
        ): FeatureManifest {
            val fullManifest = FullFeatureManifest.parse(manifestString)
            val translations = fullManifest.translations?.get(language)
            return FeatureManifest(
                name = translations?.name ?: fullManifest.name,
                author = translations?.author ?: fullManifest.author,
                version = translations?.version ?: fullManifest.version,
                description = translations?.description
                    ?: fullManifest.description,
                thumbnail = translations?.thumbnail ?: fullManifest.thumbnail,
                primaryColor = translations?.primaryColor
                    ?: fullManifest.primaryColor,
                links = translations?.links ?: fullManifest.links
            )
        }
    }
}

private class FullFeatureManifest(
    name: String?,
    author: String?,
    version: String?,
    description: String?,
    thumbnail: String?,
    primaryColor: String?,
    links: Map<String, String>?,
    val translations: Map<String, FeatureManifest>?
) : FeatureManifest(
    name = name,
    author = author,
    version = version,
    description = description,
    thumbnail = thumbnail,
    primaryColor = primaryColor,
    links = links
) {
    companion object {
        fun parse(manifestString: String): FullFeatureManifest =
            Gson().fromJson<FullFeatureManifest>(
                manifestString, FullFeatureManifest::class.java
            )
    }
}
