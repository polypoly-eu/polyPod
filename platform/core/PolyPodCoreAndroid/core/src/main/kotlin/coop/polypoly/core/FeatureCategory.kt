package coop.polypoly.core

enum class FeatureCategoryId {
    yourData,
    knowHow,
    tools,
    developer
}

data class FeatureCategory(
    val id: FeatureCategoryId,
    val name: String,
    val features: List<Feature>
    )

data class Feature(
    val path: String,
    val id: String,
    val name: String,
    val author: String?,
    val version: String?,
    val description: String?,
    val thumbnail: String?,
    val thumbnailColor: Int,
    val primaryColor: Int,
    val borderColor: Int,
    val tileTextColor: Int,
    val links: Map<String, String>
) {
    fun findUrl(target: String): String? = when (target) {
        in links.keys -> links[target]
        in links.values -> target
        else -> null
    }
}
