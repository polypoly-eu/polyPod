package coop.polypoly.polypod.homescreen

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.TextUnit
import coop.polypoly.polypod.PolyStyle

data class FontDescription(
    val family: Int,
    val weight: FontWeight,
    val size: TextUnit,
    val lineHeight: TextUnit,
    val alignment: TextAlign,
)

data class SectionStyle(
    val titleFont: FontDescription,
) {
    companion object {
        fun default(): SectionStyle {
            return SectionStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = PolyStyle().font.size.lg,
                    lineHeight = PolyStyle().font.lineHeight.lg,
                    alignment = PolyStyle().font.alignment.left
                )
            )
        }
    }
}

data class TileStyle(
    val titleFont: FontDescription,
    val descriptionFont: FontDescription?
) {
    companion object {
        fun smallTileStyle(): TileStyle {
            return TileStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = PolyStyle().font.size.xs,
                    lineHeight = PolyStyle().font.lineHeight.xs,
                    alignment = PolyStyle().font.alignment.center
                ),
                descriptionFont = null
            )
        }

        fun mediumTileStyle(): TileStyle {
            return TileStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = PolyStyle().font.size.base,
                    lineHeight = PolyStyle().font.lineHeight.base,
                    alignment = PolyStyle().font.alignment.left
                ),
                descriptionFont = FontDescription(
                    family = PolyStyle().font.family.jostRegular,
                    weight = PolyStyle().font.weight.regular,
                    size = PolyStyle().font.size.xs,
                    lineHeight = PolyStyle().font.lineHeight.xs,
                    alignment = PolyStyle().font.alignment.left
                ),
            )
        }

        fun bigTileStyle(): TileStyle {
            return TileStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = PolyStyle().font.size.base,
                    lineHeight = PolyStyle().font.lineHeight.base,
                    alignment = PolyStyle().font.alignment.left
                ),
                descriptionFont = FontDescription(
                    family = PolyStyle().font.family.jostRegular,
                    weight = PolyStyle().font.weight.regular,
                    size = PolyStyle().font.size.xs,
                    lineHeight = PolyStyle().font.lineHeight.xs,
                    alignment = PolyStyle().font.alignment.left
                ),
            )
        }
    }
}

data class FooterStyle(
    val backgroundColor: Color,
    val buttonBackgroundColor: Color,
    val titleFont: FontDescription,
    val descriptionFont: FontDescription,
    val buttonTitleFont: FontDescription
) {
    companion object {
        fun default(): FooterStyle {
            return FooterStyle(
                backgroundColor = Color(0xFFFED7D6),
                buttonBackgroundColor = Color(0xFF0F1938),
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = PolyStyle().font.size._2xl,
                    lineHeight = PolyStyle().font.lineHeight._2xl,
                    alignment = PolyStyle().font.alignment.left
                ),
                descriptionFont = FontDescription(
                    family = PolyStyle().font.family.jostRegular,
                    weight = PolyStyle().font.weight.regular,
                    size = PolyStyle().font.size.base,
                    lineHeight = PolyStyle().font.lineHeight.base,
                    alignment = PolyStyle().font.alignment.left
                ),
                buttonTitleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = PolyStyle().font.size.lg,
                    lineHeight = PolyStyle().font.lineHeight.lg,
                    alignment = PolyStyle().font.alignment.center
                )
            )
        }
    }
}
