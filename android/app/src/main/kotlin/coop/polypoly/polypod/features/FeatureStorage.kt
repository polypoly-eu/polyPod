package coop.polypoly.polypod.features

import android.content.Context
import android.graphics.Color
import coop.polypoly.polypod.R
import org.slf4j.LoggerFactory
import java.io.File
import java.io.FileOutputStream
import java.util.*
import java.util.zip.ZipFile

open class PartialFeature(
    val name: String,
    val author: String,
    val description: String,
    val primaryColorHex: String
) {
    val primaryColor = Color.parseColor(primaryColorHex)
}

class Feature(
    feature: PartialFeature,
    val content: ZipFile
) : PartialFeature(
    feature.name,
    feature.author,
    feature.description,
    feature.primaryColorHex
)

class FeatureStorage {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    fun listFeatures(context: Context): List<PartialFeature> {
        val featuresDir = getFeaturesDir(context)
        logger.warn("Features directory: '{}'", featuresDir.absolutePath)
        if (!featuresDir.exists()) {
            val created = featuresDir.mkdirs()
            logger.debug("Directory for Features created: $created")
        } else {
            logger.debug("Directory for Features already exists")
        }
        val filesList = featuresDir.listFiles()
        return if (filesList != null) {
            logger.debug("Found {} Features", filesList.size)
            val features: MutableList<PartialFeature> = ArrayList(filesList.size)
            for (file in filesList) {
                logger.debug("Found file: '${file.absolutePath}'")
                features.add(loadFeatureData(context, file.name))
            }
            for (feature in features) {
                logger.debug("Found Feature: '{}'", feature.name)
            }
            features
        } else {
            logger.debug("No Features found")
            emptyList()
        }
    }

    private fun loadFeatureData(context: Context, fileName: String): PartialFeature {
        // TODO: Actually read this information from the feature manifest
        val name = fileName.replace(".zip", "")
        val author = getMetaDataString(context, name, "author")
        val description = getMetaDataString(context, name, "description")
        val primaryColor = getMetaDataString(context, name, "primaryColor")
        return PartialFeature(name, author, description, primaryColor)
    }

    private fun getMetaDataString(context: Context, featureName: String, key: String): String {
        return context.getString(context.resources.getIdentifier(
            "feature_${featureName}_$key".toLowerCase(),
            "string",
            context.packageName
        ))
    }

    fun loadFeature(context: Context, name: String): Feature {
        val feature = loadFeatureData(context, name)
        return Feature(feature, ZipFile(File(getFeaturesDir(context), "$name.zip")))
    }

    fun installBundledFeatures(context: Context) {
        for (featureBundle in context.assets.list("features").orEmpty()) {
            logger.debug("Installing $featureBundle from assets")
            val source = context.assets.open("features/$featureBundle")
            val featuresDir = getFeaturesDir(context)
            featuresDir.mkdirs()
            val destination = FileOutputStream(File(featuresDir, featureBundle))
            source.copyTo(destination)
        }
    }

    private fun getFeaturesDir(context: Context) = File(context.filesDir, "features")
}
