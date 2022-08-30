package coop.polypoly.polypod.features

import android.content.Context
import coop.polypoly.core.Core
import coop.polypoly.core.Feature
import coop.polypoly.core.FeatureCategory
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.polyNav.ZipTools
import java.io.File
import java.io.FileOutputStream
import kotlin.io.path.Path

object FeatureStorage {
    private val logger = LoggerFactory.getLogger(FeatureStorage::class.java)
    var activeFeatureId: String? = null

    var categories: List<FeatureCategory> = ArrayList()

    fun importFeatures(context: Context) {
        val featuresDir = getFeaturesDir(context)
        logger.warn("Features directory: '{}'", featuresDir.absolutePath)
        if (!featuresDir.exists()) {
            val created = featuresDir.mkdirs()
            logger.debug("Directory for Features created: $created")
        } else {
            logger.debug("Directory for Features already exists")
        }

        copyFeatureCategories(context)
        copyFeatures(context)
        categories = Core.loadFeatureCategories(
            getFeaturesDir(context).path,
            emptyList()
        )
    }

    fun featureForId(id: String): Feature? {
        for (category in categories) {
            for (feature in category.features) {
                if (feature.id == id) {
                    return feature
                }
            }
        }
        logger.error("No feature '{}' was loaded", id)
        return null
    }

    private fun copyFeatureCategories(context: Context) {
        val source = context.assets.open("features/categories.json")
        val featuresDir = getFeaturesDir(context)
        val destination = FileOutputStream(File(featuresDir, "categories.json"))
        source.copyTo(destination)
    }

    private fun copyFeatures(context: Context) {
        val features = context
            .assets
            .list("features")
            ?.filter {
                it.endsWith("zip")
            }

        if (features == null || features.isEmpty()) {
            throw Exception("No features were found")
        } else {
            features.forEach { zipName ->
                val source = context.assets.open("features/$zipName")
                val featuresDir = getFeaturesDir(context)
                val destZipFile = File(featuresDir, zipName)
                source.copyTo(FileOutputStream(destZipFile))
                val featureName = zipName.removeSuffix(".zip")
                ZipTools.unzip(
                    destZipFile,
                    Path(featuresDir.path.plus("/$featureName"))
                )
                destZipFile.delete()
            }
        }
    }

    private fun getFeaturesDir(context: Context) =
        File(context.filesDir, "features")
}
