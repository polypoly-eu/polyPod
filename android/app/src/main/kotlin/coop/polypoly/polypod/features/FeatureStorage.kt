package coop.polypoly.polypod.features

import android.content.Context
import coop.polypoly.polypod.R
import org.slf4j.LoggerFactory
import java.io.File
import java.io.FileOutputStream
import java.util.*
import java.util.zip.ZipFile

class Feature(val name: String, val author: String, val description: String, val primaryColor: String)

class FeatureStorage {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    fun listFeatures(context: Context): List<Feature> {
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
            val features: MutableList<Feature> = ArrayList(filesList.size)
            for (file in filesList) {
                logger.debug("Found file: '${file.absolutePath}'")
                features.add(loadMetaData(context, file.name))
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

    private fun loadMetaData(context: Context, fileName: String): Feature {
        // TODO: Actually read this information from the feature manifest
        val name = fileName.replace(".zip", "")
        val author = getMetaDataString(context, "author")
        val description = getMetaDataString(context, "description")
        val primaryColor = getMetaDataString(context, "primaryColor")
        return Feature(name, author, description, primaryColor)
    }

    private fun getMetaDataString(context: Context, key: String): String {
        // TODO: Don't hard code 'polyexplorer'
        return mapOf(
            "author" to context.getString(R.string.feature_polyexplorer_author),
            "description" to context.getString(R.string.feature_polyexplorer_description),
            "primaryColor" to context.getString(R.string.feature_polyexplorer_primary_color)
        )[key] ?: ""
    }

    fun loadFeature(context: Context, name: String): ZipFile {
        return ZipFile(File(getFeaturesDir(context), "$name.zip"))
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
