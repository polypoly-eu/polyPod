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
    val id: String get() = fileName.replace(".zip", "")
    val name: String get() = manifest.name ?: id
    val author: String get() = manifest.author ?: ""
    val description: String get() = manifest.description ?: ""

    val primaryColor: Int
        get() = runCatching { Color.parseColor(manifest.primaryColor) }
            .getOrDefault(0)

    val thumbnailColor: Int
        get() = runCatching { Color.parseColor(manifest.thumbnailColor) }
            .getOrDefault(primaryColor)

    val thumbnail: Bitmap?
        get() {
            if (manifest.thumbnail == null) return null
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
