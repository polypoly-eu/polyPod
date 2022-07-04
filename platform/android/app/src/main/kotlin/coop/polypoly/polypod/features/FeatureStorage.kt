package coop.polypoly.polypod.features

import FeatureManifest
import android.content.Context
import com.google.gson.Gson
import coop.polypoly.core.Core
import coop.polypoly.polypod.logging.LoggerFactory
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipFile

data class RawCategory(
    val id: String,
    val name: String,
    val features: List<String>,
    val visible: Boolean?
)

enum class FeatureCategory {
    yourData,
    knowHow,
    tools,
    developer
}

data class FeatureCategoryModel(
    val category: FeatureCategory,
    val name: String,
    val features: List<Feature>
)

object FeatureStorage {
    private val logger = LoggerFactory.getLogger(FeatureStorage::class.java)
    var activeFeatureId: String? = null

    val categories: MutableList<FeatureCategoryModel> = ArrayList()

    fun importFeatures(context: Context) {
        val featuresDir = getFeaturesDir(context)
        logger.warn("Features directory: '{}'", featuresDir.absolutePath)
        if (!featuresDir.exists()) {
            val created = featuresDir.mkdirs()
            logger.debug("Directory for Features created: $created")
        } else {
            logger.debug("Directory for Features already exists")
        }

        categories.clear()
        val rawCategories = readCategories(context)

        for (rawCategory in rawCategories) {
            if (rawCategory.features.isEmpty()) {
                continue
            }
            val categoryId = FeatureCategory.valueOf(rawCategory.id)
            if (rawCategory.visible == false) {
                logger.debug("Category $categoryId not visible, ignored")
                continue
            }

            val features: MutableList<Feature> = ArrayList()
            for (featureId in rawCategory.features) {
                importFeature(context, featureId)
                features.add(loadFeature(context, featureId))
            }

            val categoryModel = FeatureCategoryModel(
                categoryId,
                rawCategory.name,
                features
            )

            categories.add(categoryModel)
        }
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

    private fun importFeature(context: Context, id: String) {
        logger.debug("Installing $id from assets")
        val source = context.assets.open("features/$id.zip")
        val featuresDir = getFeaturesDir(context)
        featuresDir.mkdirs()
        val destination = FileOutputStream(File(featuresDir, "$id.zip"))
        source.copyTo(destination)
    }

    private fun readCategories(context: Context): List<RawCategory> {
        val categoriesJson = context.assets
            .open("features/categories.json")
            .reader()
            .readText()
        return Gson()
            .fromJson(categoriesJson, Array<RawCategory>::class.java)
            .toList()
    }

    private fun loadFeature(context: Context, fileName: String): Feature {
        val content = ZipFile(File(getFeaturesDir(context), "$fileName.zip"))
        val manifest = readManifest(content)
        return Feature(fileName, content, context, manifest)
    }

    private fun readManifest(
        content: ZipFile
    ): FeatureManifest? {
        val manifestEntry = content.getEntry("manifest.json")
        if (manifestEntry == null) {
            logger.warn("Missing manifest for '${content.name}'")
            return null
        }
        val manifestString =
            content.getInputStream(manifestEntry).reader().readText()

        return try {
            Core.parseFeatureManifest(manifestString)
        } catch (ex: Exception) {
            logger.error(ex.message)
            null
        }
    }

    private fun getFeaturesDir(context: Context) =
        File(context.filesDir, "features")
}
