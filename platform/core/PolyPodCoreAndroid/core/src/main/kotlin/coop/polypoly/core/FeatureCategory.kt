package coop.polypoly.core

import org.msgpack.value.Value

enum class FeatureCategoryId {
    yourData,
    knowHow,
    tools,
    developer;

    companion object {
        fun from(value: Value): FeatureCategoryId {
            return FeatureCategoryId.valueOf(value.toString())
        }
    }
}

data class FeatureCategory(
    val id: FeatureCategoryId,
    val name: String,
    val features: List<Feature>
) {
    companion object {
        fun from(value: Value): FeatureCategory {
            val map = value.asMapValue().map()

            return FeatureCategory(
                FeatureCategoryId.from(map.getValue("id")),
                map.getValue("name").toString(),
                map.getValue("features").asArrayValue().map(Feature::from)
            )
        }
    }
}

data class Feature(
    val path: String,
    val id: String,
    val name: String,
    val author: String?,
    val version: String?,
    val description: String?,
    val thumbnail: String?,
    val primaryColor: Int,
    val thumbnailColor: Int,
    val borderColor: Int,
    val tileTextColor: Int,
    val links: Map<String, String>
) {
    companion object {
        fun from(value: Value): Feature {
            val map = value.asMapValue().map()

            return Feature(
                map.getString("path"),
                id = map.getString("id"),
                name = map.getString("name"),
                author = map.getOptionalString("author"),
                version = map.getOptionalString("version"),
                description = map.getOptionalString("description"),
                thumbnail = map.getOptionalString("thumbnail"),
                thumbnailColor = map.getColor("thumbnailColor"),
                primaryColor = map.getColor("primaryColor"),
                borderColor = map.getColor("borderColor"),
                tileTextColor = map.getColor("tileTextColor"),
                links = map.getValue("links").asMapValue().map().map {
                    it.key.asStringValue().asString() to
                        it.value.asStringValue().asString()
                }.toMap()
            )
        }
    }

    fun findUrl(target: String): String? = when (target) {
        in links.keys -> links[target]
        in links.values -> target
        else -> null
    }
}
