package coop.polypoly.core

data  class FeatureManifest(
    val name: String?,
    val author: String?,
    val version: String?,
    val description: String?,
    val thumbnail: String?,
    val thumbnailColor: String?,
    val primaryColor: String?,
    val links: Map<String, String>?
)
