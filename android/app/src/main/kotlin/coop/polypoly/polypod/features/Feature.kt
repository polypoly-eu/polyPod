package coop.polypoly.polypod.features

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.DisplayMetrics
import java.util.zip.ZipFile

class Feature(
    val fileName: String,
    val content: ZipFile,
    private val manifest: FeatureManifest
) {
    val name: String get() = manifest.name ?: fileName.replace(".zip", "")
    val author: String get() = manifest.author ?: ""
    val description: String get() = manifest.description ?: ""

    val primaryColor: Int
        get() = runCatching { Color.parseColor(manifest.primaryColor) }
            .getOrDefault(0)

    val thumbnail: Bitmap?
        get() {
            val entry = content.getEntry(manifest.thumbnail) ?: return null
            val options = BitmapFactory.Options()
            // For now, we assume all thumbnails are xhdpi, i.e. 2x scale factor
            options.inDensity = DisplayMetrics.DENSITY_XHIGH
            content.getInputStream(entry).use {
                return BitmapFactory.decodeStream(it, null, options)
            }
        }

    fun findUrl(target: String): String? = when (target) {
        in manifest.links?.keys ?: listOf() -> manifest.links?.get(target)
        in manifest.links?.values ?: listOf() -> target
        else -> null
    }
}
