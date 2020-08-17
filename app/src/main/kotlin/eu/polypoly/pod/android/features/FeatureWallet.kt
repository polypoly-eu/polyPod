package eu.polypoly.pod.android.features

import android.content.Context
import org.slf4j.LoggerFactory
import java.io.File
import java.util.*

class FeatureWallet {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    public fun listFeatures(context: Context): List<String> {
        val mainDir = context.getExternalFilesDir(null)
        val featuresDir = File(mainDir, "features")
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
            val features: MutableList<String> = ArrayList(filesList.size)
            for (file in filesList) {
                logger.debug("Found file: '${file.absolutePath}'")
                features.add(file.name.replace(".zip", ""))
            }
            for (feature in features) {
                logger.debug("Found Feature: '{}'", feature)
            }
            features
        } else {
            logger.debug("No Features found")
            emptyList()
        }
    }
}
