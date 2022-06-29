package coop.polypoly.polypod

import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class PolyStyle(
    val spacing: PolySpacing = PolySpacing(),
    val radius: PolyRadius = PolyRadius(),
    val font: PolyFont = PolyFont(),
    val border: PolyBorder = PolyBorder()
)

data class PolySpacing(
    val _1x: Dp = 4.dp,
    val _2x: Dp = (2 * _1x.value).dp,
    val _3x: Dp = (3 * _1x.value).dp,
    val _4x: Dp = (4 * _1x.value).dp,
    val _5x: Dp = (5 * _1x.value).dp,
    val _6x: Dp = (6 * _1x.value).dp,
    val _7x: Dp = (7 * _1x.value).dp,
    val _8x: Dp = (8 * _1x.value).dp,
)

data class PolyRadius(
    val _1x: Dp = 4.dp,
    val _2x: Dp = (2 * _1x.value).dp,
    val _3x: Dp = (3 * _1x.value).dp,
    val _4x: Dp = (4 * _1x.value).dp,
    val _5x: Dp = (5 * _1x.value).dp,
    val _6x: Dp = (6 * _1x.value).dp,
)

data class PolyFontFamily(
    val jostRegular: Int = R.font.jost_regular,
    val jostMedium: Int = R.font.jost_medium,
)

data class PolyFontSize(
    val xs: TextUnit = 12.sp,
    val sm: TextUnit = 14.sp,
    val base: TextUnit = 16.sp,
    val lg: TextUnit = 18.sp,
    val xl: TextUnit = 20.sp,
    val _2xl: TextUnit = 22.sp
)

data class PolyFontLineHeight(
    val xs: TextUnit = (1.2 * PolyFontSize().xs.value).sp,
    val sm: TextUnit = (1.2 * PolyFontSize().sm.value).sp,
    val base: TextUnit = (1.2 * PolyFontSize().base.value).sp,
    val lg: TextUnit = (1.2 * PolyFontSize().lg.value).sp,
    val xl: TextUnit = (1.2 * PolyFontSize().xl.value).sp,
    val _2xl: TextUnit = (1.2 * PolyFontSize()._2xl.value).sp
)

data class PolyFontAlignment(
    val left: TextAlign = TextAlign.Start,
    val center: TextAlign = TextAlign.Center,
    val right: TextAlign = TextAlign.End,
    val justify: TextAlign = TextAlign.Justify
)

data class PolyFontWeight(
    val regular: FontWeight = FontWeight.Normal,
    val medium: FontWeight = FontWeight.Medium
)

data class PolyFont(
    val family: PolyFontFamily = PolyFontFamily(),
    val weight: PolyFontWeight = PolyFontWeight(),
    val size: PolyFontSize = PolyFontSize(),
    val lineHeight: PolyFontLineHeight = PolyFontLineHeight(),
    val alignment: PolyFontAlignment = PolyFontAlignment()
)

data class PolyBorderSize(
    val _1x: Dp = 1.dp,
    val _2x: Dp = (2 * _1x.value).dp,
    val _3x: Dp = (3 * _1x.value).dp,
    val _4x: Dp = (4 * _1x.value).dp,
    val _5x: Dp = (5 * _1x.value).dp,
    val _6x: Dp = (6 * _1x.value).dp,
)

data class PolyBorder(
    val size: PolyBorderSize = PolyBorderSize(),
)
