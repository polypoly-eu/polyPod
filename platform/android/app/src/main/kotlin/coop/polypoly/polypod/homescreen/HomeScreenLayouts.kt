package coop.polypoly.polypod.homescreen

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import coop.polypoly.polypod.PolyStyle

data class TileLayout(
    val width: Dp,
    val height: Dp,
    val verticalSpacing: Dp,
    val topPadding: Dp,
    val startPadding: Dp,
    val endPadding: Dp,
    val bottomPadding: Dp,
    val cornerRadius: Dp,
    val textVerticalSpacing: Dp,
    val textTopPadding: Dp,
    val textBottomPadding: Dp,
    val textStartPadding: Dp,
    val textEndPadding: Dp,
    val borderWidth: Dp
) {
    companion object {
        fun smallCard(width: Float, height: Float): TileLayout {
            return TileLayout(
                width = width.dp,
                height = height.dp,
                verticalSpacing = 0.dp,
                topPadding = 0.dp,
                startPadding = PolyStyle().spacing._2x,
                endPadding = PolyStyle().spacing._2x,
                bottomPadding = PolyStyle().spacing._2x,
                cornerRadius = PolyStyle().radius._2x,
                textVerticalSpacing = 0.dp,
                textTopPadding = 0.dp,
                textBottomPadding = 0.dp,
                textStartPadding = 0.dp,
                textEndPadding = 0.dp,
                borderWidth = PolyStyle().border.size._1x
            )
        }

        fun mediumCard(width: Float, height: Float, multiplier: Float): TileLayout { // ktlint-disable max-line-length
            return TileLayout(
                width = width.dp,
                height = height.dp,
                verticalSpacing = 0.dp,
                topPadding = 0.dp,
                startPadding = 0.dp,
                endPadding = 0.dp,
                bottomPadding = 0.dp,
                cornerRadius = PolyStyle().radius._2x,
                textVerticalSpacing = PolyStyle().spacing._2x,
                textTopPadding = (multiplier * PolyStyle().spacing._2x.value).dp, // ktlint-disable max-line-length
                textBottomPadding = PolyStyle().spacing._2x,
                textStartPadding = PolyStyle().spacing._3x,
                textEndPadding = PolyStyle().spacing._4x,
                borderWidth = PolyStyle().border.size._1x
            )
        }

        fun bigCard(width: Float, height: Float): TileLayout {
            return TileLayout(
                width = width.dp,
                height = height.dp,
                verticalSpacing = PolyStyle().spacing._2x,
                topPadding = PolyStyle().spacing._4x,
                startPadding = PolyStyle().spacing._4x,
                endPadding = PolyStyle().spacing._4x,
                bottomPadding = PolyStyle().spacing._4x,
                cornerRadius = PolyStyle().radius._2x,
                textVerticalSpacing = 0.dp,
                textTopPadding = 0.dp,
                textBottomPadding = 0.dp,
                textStartPadding = 0.dp,
                textEndPadding = 0.dp,
                borderWidth = PolyStyle().border.size._1x
            )
        }
    }
}

data class ContainerLayout(
    val verticalInterItemSpacing: Dp,
    val horizontalInterItemSpacing: Dp
) {
    companion object {
        fun default(): ContainerLayout {
            return ContainerLayout(
                horizontalInterItemSpacing = PolyStyle().spacing._3x,
                verticalInterItemSpacing = PolyStyle().spacing._3x
            )
        }
    }
}

data class SectionLayout(
    val verticalSpacing: Dp
) {
    companion object {
        fun default(): SectionLayout {
            return SectionLayout(verticalSpacing = PolyStyle().spacing._3x)
        }
    }
}

data class ScreenLayout(
    val width: Dp,
    val horizontalPadding: Dp,
    val verticalSpacing: Dp
) {
    companion object {
        fun default(width: Int): ScreenLayout {
            return ScreenLayout(
                horizontalPadding = PolyStyle().spacing._4x,
                verticalSpacing = PolyStyle().spacing._8x,
                width = width.dp
            )
        }
    }
}

data class FooterLayout(
    val padding: Dp,
    val verticalSpacing: Dp,
    val cornerRadius: Dp
) {
    companion object {
        fun default(): FooterLayout {
            return FooterLayout(
                padding = PolyStyle().spacing._6x,
                verticalSpacing = PolyStyle().spacing._4x,
                cornerRadius = PolyStyle().radius._2x
            )
        }
    }
}
