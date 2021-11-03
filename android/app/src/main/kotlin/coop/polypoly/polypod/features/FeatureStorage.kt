package coop.polypoly.polypod.features

import android.content.Context
import coop.polypoly.polypod.logging.LoggerFactory
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipFile

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
        val manifest = readManifest(context, content)
        return Feature(fileName, content, manifest)
    }

    private fun readManifest(
        context: Context,
        content: ZipFile
    ): FeatureManifest {
        val manifestEntry = content.getEntry("manifest.json")
        if (manifestEntry == null) {
            logger.warn("Missing manifest for '${content.name}'")
            return FeatureManifest(null, null, null, null, null, null, null)
        }
        val manifestString =
            content.getInputStream(manifestEntry).reader().readText()
        return FeatureManifest.parse(manifestString, determineLanguage(context))
    }

    private fun determineLanguage(context: Context): String {
        val supportedLocales = arrayOf("en", "de")
        val userLocale = context.resources.configuration.locales.getFirstMatch(
            supportedLocales
        )
        return userLocale?.language ?: "en"
    }

    private fun sortFeatures(
        context: Context,
        features: List<Feature>
    ): List<Feature> {
        val order = readOrder(context)
        val sorted = mutableListOf<Feature>()
        for (id in order)
            features.find { it.id == id }?.let {
                sorted.add(it)
            }
        for (feature in features)
            if (!order.contains(feature.id))
                sorted.add(feature)
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
