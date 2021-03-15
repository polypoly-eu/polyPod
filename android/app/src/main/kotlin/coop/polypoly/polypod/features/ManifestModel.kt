package coop.polypoly.polypod.features

class ManifestModel(
    val name: String,
    val author: String,
    val version: String,
    val description: String,
    val thumbnail: String,
    val primaryColor: String,
    val links: Map<String, String>
) {
    override fun toString(): String {
        return "Manifest [name: ${this.name}]"
    }
}
