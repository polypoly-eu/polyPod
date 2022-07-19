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
    val thumbnailColor: String,
    val primaryColor: String,
    val borderColor: String,
    val tileTextColor: String,
    val links: Map<String, String>
)
