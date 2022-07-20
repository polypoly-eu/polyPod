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
import java.io.File

data class SectionModel(
    val title: String,
    val type: SectionType,
    val tiles: List<TileModel>
)

enum class SectionType {
    YOUR_DATA,
    DATA_KNOW_HOW,
    TOOLS,
    DEVELOPER;

    companion object {
        fun fromCategoryType(type: FeatureCategoryId): SectionType {
            return when (type) {
                FeatureCategoryId.yourData -> YOUR_DATA
                FeatureCategoryId.knowHow -> DATA_KNOW_HOW
                FeatureCategoryId.tools -> TOOLS
                FeatureCategoryId.developer -> DEVELOPER
            }
        }
    }
}

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
    val type: SectionType,
    val model: SectionModel,
    val containers: List<Container>,
    val layout: SectionLayout,
    val style: SectionStyle
) {
    companion object {}
}

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
                SectionType.fromCategoryType(category.id),
                category.features.map { feature ->
                    TileModel(
                        feature.name,
                        feature.description ?: "",
                        createTileThumbnailBitmap(context, feature.thumbnail),
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
        path: String?
    ): Bitmap? {
        if (path == null) {
            return null
        }
        if (path.endsWith(".pdf")) {
            return PDFBitmap
                .bitmapFromPDF(
                    File(path).inputStream(),
                    context.resources.displayMetrics.densityDpi
                )
        } else {
            val options = BitmapFactory.Options()
            // For now, we assume all thumbnails are xhdpi, i.e. 2x scale factor
            options.inDensity = DisplayMetrics.DENSITY_XHIGH
            File(path).inputStream().use {
                return BitmapFactory.decodeStream(it, null, options)
            }
        }
    }
}
