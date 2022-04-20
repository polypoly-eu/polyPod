package coop.polypoly.polypod.features

import android.content.Context
import coop.polypoly.core.Core
import coop.polypoly.polypod.logging.LoggerFactory
import FeatureManifest
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipFile

class FeatureStorage {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)

        var activeFeature: Feature? = null
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
        val filesList =
            featuresDir.listFiles { _, name -> name.endsWith(".zip") }
        if (filesList == null) {
            logger.debug("No Features found")
            return emptyList()
        }

        logger.debug("Found {} Features", filesList.size)
        val features: MutableList<Feature> = ArrayList(filesList.size)
        for (file in filesList) {
            logger.debug("Found file: '${file.absolutePath}'")
            features.add(loadFeature(context, file.name))
        }
        val sorted = sortFeatures(context, features)
        for (feature in sorted) {
            logger.debug("Found Feature: '{}'", feature.name)
        }
        return sorted
    }

    fun loadFeature(context: Context, fileName: String): Feature {
        val content = ZipFile(File(getFeaturesDir(context), fileName))
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

        return Core.parseFeatureManifest(manifestString).getOrNull()
    }

    private fun sortFeatures(
        context: Context,
        features: List<Feature>
    ): List<Feature> {
        val order = readOrder(context)
        val sorted = mutableListOf<Feature>()
        // Features present on disk, e.g. because they were previously present
        // and then removed, or because they were manually installed via adb,
        // will not show up in the list. We might want to include a setting
        // to allow users to still show them, or we might want to add some
        // logic for removing features that are not supposed to be shown.
        for (id in order)
            features.find { it.id == id }?.let {
                sorted.add(it)
            }
        return sorted
    }

    private fun readOrder(context: Context) =
        context.assets.open("features/order").bufferedReader()
            .use { it.readLines() }

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

    private fun getFeaturesDir(context: Context) =
        File(context.filesDir, "features")
}
