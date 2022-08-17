package coop.polypoly.polypod.homescreen

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.DisplayMetrics
import androidx.compose.ui.graphics.Color
import coop.polypoly.core.FeatureCategoryId
import coop.polypoly.polypod.PDFBitmap
import coop.polypoly.polypod.R
import coop.polypoly.polypod.features.FeatureStorage
import org.apache.jena.atlas.logging.Log
import java.io.File

data class SectionModel(
    val title: String,
    val id: FeatureCategoryId,
    val tiles: List<TileModel>
)

data class TileModel(
    val title: String,
    val description: String,
    val image: Bitmap?,
    val backgroundColor: Color,
    val borderColor: Color,
    val tileTextColor: Color,
    val onSelection: () -> Unit
)

data class FooterModel(
    val title: String,
    val description: String,
    val buttonTitle: String
) {
    fun buttonOpenUri(context: Context): Uri {
        return Uri.parse(
            context.getString(
                R.string.homescreen_footer_button_open_url
            )
        )
    }
}

data class Screen(
    val sections: List<Section>,
    val footer: Footer,
    val layout: ScreenLayout
)

enum class TileType {
    SMALL,
    MEDIUM,
    BIG
}

data class Tile(
    val model: TileModel,
    val style: TileStyle,
    val layout: TileLayout,
    val type: TileType
)

enum class ContainerType {
    LARGELEFT,
    ROW,
    LARGERIGHT
}

data class Container(
    val type: ContainerType,
    val tiles: List<Tile>,
    val layout: ContainerLayout
)

data class Section(
    val id: FeatureCategoryId,
    val model: SectionModel,
    val containers: List<Container>,
    val layout: SectionLayout,
    val style: SectionStyle
)

data class Footer(
    val model: FooterModel,
    val style: FooterStyle,
    val layout: FooterLayout
)

class HomeScreenViewModel {
    fun getSectionModels(
        context: Context,
        onFeatureSelected: (String) -> Unit
    ): List<SectionModel> {
        return FeatureStorage.categories.map { category ->
            SectionModel(
                category.name,
                category.id,
                category.features.map { feature ->
                    TileModel(
                        feature.name,
                        feature.description ?: "",
                        feature.thumbnail?.let {
                            createTileThumbnailBitmap(context, File(it))
                        },
                        Color(feature.thumbnailColor),
                        Color(feature.borderColor),
                        Color(feature.tileTextColor),
                    ) {
                        onFeatureSelected(feature.id)
                    }
                }
            )
        }
    }

    private fun createTileThumbnailBitmap(
        context: Context,
        file: File
    ): Bitmap? {
        try {
            if (file.path.endsWith(".pdf")) {
                return PDFBitmap
                    .bitmapFromPDF(
                        file,
                        context.resources.displayMetrics.densityDpi
                    )
            } else {
                val options = BitmapFactory.Options()
                // For now, we assume all thumbnails are xhdpi, i.e. 2x scale factor
                options.inDensity = DisplayMetrics.DENSITY_XHIGH
                file.inputStream().use {
                    return BitmapFactory.decodeStream(it, null, options)
                }
            }
        } catch (ex: Exception) {
            Log.error(file, "Failed to create thumbnail for the feature $file")
            return null
        }
    }
}
