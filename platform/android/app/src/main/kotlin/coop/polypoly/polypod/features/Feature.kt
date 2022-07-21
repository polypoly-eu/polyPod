package coop.polypoly.polypod.features

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import android.util.DisplayMetrics
import coop.polypoly.core.FeatureManifest
import coop.polypoly.polypod.PDFBitmap
import java.io.File
import java.util.zip.ZipFile

class Feature(
    private val fileName: String,
    val content: ZipFile,
    private val context: Context,
    private val manifest: FeatureManifest?
) {
    val id: String get() = fileName.replace(".zip", "")
    val name: String get() = manifest?.name ?: id
    val description: String get() = manifest?.description ?: ""

    val primaryColor: Int
        get() = runCatching { Color.parseColor(manifest?.primaryColor) }
            .getOrDefault(0)

    val thumbnailColor: Int
        get() = runCatching { Color.parseColor(manifest?.thumbnailColor) }
            .getOrDefault(primaryColor)

    val borderColor: Int
        get() = runCatching { Color.parseColor(manifest?.borderColor) }
            .getOrDefault(primaryColor)

    val tileTextColor: Int
        get() = runCatching { Color.parseColor(manifest?.tileTextColor) }
            .getOrDefault(0)

    val thumbnail: Bitmap?
        get() {
            if (manifest?.thumbnail == null) return null
            val entry = content.getEntry(manifest.thumbnail) ?: return null
            if (entry.name.endsWith(".pdf")) {
                return PDFBitmap
                    .bitmapFromPDF(
                        File(entry.name),
                        context.resources.displayMetrics.densityDpi
                    )
            } else {
                val options = BitmapFactory.Options()
                // For now, we assume all thumbnails are xhdpi, i.e. 2x scale factor
                options.inDensity = DisplayMetrics.DENSITY_XHIGH
                content.getInputStream(entry).use {
                    return BitmapFactory.decodeStream(it, null, options)
                }
            }
        }

    fun findUrl(target: String): String? = when (target) {
        in manifest?.links?.keys ?: listOf() -> manifest?.links?.get(target)
        in manifest?.links?.values ?: listOf() -> target
        else -> null
    }
}
