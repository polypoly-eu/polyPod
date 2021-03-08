package coop.polypoly.polypod.features

import android.content.Context
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
                // TODO: Read this information from the feature manifest
                val name = file.name.replace(".zip", "")
                val author = "polypoly - Die Genossenschaft"
                val description = "Haben Sie sich schon mal gefragt, welche Firmen welche Ihrer Daten sammeln, an Dritte weitergeben und vor allem was das für Sie heißt? Der polyExplorer zeigt Ihnen genau das und bringt Licht ins Daten-Dunkel."
                val primaryColor = "#0f1938"
                features.add(Feature(name, author, description, primaryColor))
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
