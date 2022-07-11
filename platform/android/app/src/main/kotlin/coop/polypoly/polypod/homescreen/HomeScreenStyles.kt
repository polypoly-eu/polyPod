package coop.polypoly.polypod.homescreen

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.sp
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
        fun default(multiplier: Float): SectionStyle {
            return SectionStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = (multiplier * PolyStyle().font.size.lg.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.lg.value).sp,
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
        fun smallTileStyle(multiplier: Float): TileStyle {
            return TileStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = (multiplier * PolyStyle().font.size.xs.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.xs.value).sp, // ktlint-disable max-line-length
                    alignment = PolyStyle().font.alignment.center
                ),
                descriptionFont = null
            )
        }

        fun mediumTileStyle(multiplier: Float): TileStyle {
            return TileStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = (multiplier * PolyStyle().font.size.base.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.base.value).sp, // ktlint-disable max-line-length
                    alignment = PolyStyle().font.alignment.left
                ),
                descriptionFont = FontDescription(
                    family = PolyStyle().font.family.jostRegular,
                    weight = PolyStyle().font.weight.regular,
                    size = (multiplier * PolyStyle().font.size.xs.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.xs.value).sp, // ktlint-disable max-line-length
                    alignment = PolyStyle().font.alignment.left
                ),
            )
        }

        fun bigTileStyle(multiplier: Float): TileStyle {
            return TileStyle(
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = (multiplier * PolyStyle().font.size.base.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.base.value).sp, // ktlint-disable max-line-length
                    alignment = PolyStyle().font.alignment.left
                ),
                descriptionFont = FontDescription(
                    family = PolyStyle().font.family.jostRegular,
                    weight = PolyStyle().font.weight.regular,
                    size = (multiplier * PolyStyle().font.size.xs.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.xs.value).sp, // ktlint-disable max-line-length
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
        fun default(multiplier: Float): FooterStyle {
            return FooterStyle(
                backgroundColor = Color(0xFFFED7D6),
                buttonBackgroundColor = Color(0xFF0F1938),
                titleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = (multiplier * PolyStyle().font.size._2xl.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight._2xl.value).sp,
                    alignment = PolyStyle().font.alignment.left
                ),
                descriptionFont = FontDescription(
                    family = PolyStyle().font.family.jostRegular,
                    weight = PolyStyle().font.weight.regular,
                    size = (multiplier * PolyStyle().font.size.base.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.base.value).sp,
                    alignment = PolyStyle().font.alignment.left
                ),
                buttonTitleFont = FontDescription(
                    family = PolyStyle().font.family.jostMedium,
                    weight = PolyStyle().font.weight.medium,
                    size = (multiplier * PolyStyle().font.size.lg.value).sp,
                    lineHeight = (multiplier * PolyStyle().font.lineHeight.lg.value).sp,
                    alignment = PolyStyle().font.alignment.center
                )
            )
        }
    }
}
