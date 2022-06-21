package coop.polypoly.polypod.features

import FeatureManifest
import android.content.Context
import com.google.gson.Gson
import coop.polypoly.core.Core
import coop.polypoly.polypod.logging.LoggerFactory
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipFile

data class RawCatagory(
    val id: String,
    val name: String,
    val features: List<String>)

enum class FeatureCategory {
    yourData,
    knowHow,
    tools
}

data class FeatureCategoryModel(
    val category: FeatureCategory,
    val name: String,
    val features: List<Feature>
)

object FeatureStorage {
    @Suppress("JAVA_CLASS_ON_COMPANION")
    private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    var activeFeatureId: String? = null

    val categories: MutableList<FeatureCategoryModel> = ArrayList()

    fun featureForId(id: String): Feature? {
        for (category in categories) {
            for (feature in category.features) {
                if (feature.id == id) {
                    return feature
                }
            }
        }
        return null
    }

    fun importFeatures(context: Context) {
        val featuresDir = getFeaturesDir(context)
        logger.warn("Features directory: '{}'", featuresDir.absolutePath)
        if (!featuresDir.exists()) {
            val created = featuresDir.mkdirs()
            logger.debug("Directory for Features created: $created")
        } else {
            logger.debug("Directory for Features already exists")
        }

        val rawCategories = readCategories(context)

        categories.clear()

        for (rawCategory in rawCategories) {
            val categoryId = FeatureCategory.valueOf(rawCategory.id)
            if (categoryId == null) {
                continue
            }

            var features: MutableList<Feature> = ArrayList()

            for (featureId in rawCategory.features) {
                importFeature(context, featureId)
                val feature = loadFeature(context, featureId)
                features.add(feature)
            }

            val categoryModel = FeatureCategoryModel(
                categoryId,
                rawCategory.name,
                features
            )

            categories.add(categoryModel)
        }
    }

    fun importFeature(context: Context, id: String) {
        logger.debug("Installing $id from assets")
        val source = context.assets.open("features/$id.zip")
        val featuresDir = getFeaturesDir(context)
        featuresDir.mkdirs()
        val destination = FileOutputStream(File(featuresDir, "$id.zip"))
        source.copyTo(destination)
        val filesList =
            featuresDir.listFiles { _, name -> name.endsWith(".zip") }
    }

    private fun readCategories(context: Context): List<RawCatagory> {
        val categoriesJson = context.assets.open("features/categories.json").reader().readText()
        return Gson().fromJson(categoriesJson, Array<RawCatagory>::class.java).toList()
    }

    fun loadFeature(context: Context, fileName: String): Feature {
        val filesList =
            getFeaturesDir(context).listFiles { _, name -> name.endsWith(".zip") }
        val content = ZipFile(File(getFeaturesDir(context), "$fileName.zip"))
        val manifest = readManifest(content)
        return Feature(fileName, content, manifest)
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
