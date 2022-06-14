package coop.polypoly.polypod

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.defaultMinSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Card
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.accompanist.flowlayout.FlowRow

class HomeScreenActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // TODO
        }
    }
}

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

data class PolyStyle(
    val spacing: PolySpacing = PolySpacing(),
    val radius: PolyRadius = PolyRadius(),
    val font: PolyFont = PolyFont(),
    val border: PolyBorder = PolyBorder()
)

enum class TileType {
    SMALL,
    MEDIUM,
    BIG
}

data class TileModel(
    val title: String,
    val description: String,
    val imageId: Int,
    val backgroundColor: Color
)

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

enum class SectionType {
    YOUR_DATA,
    DATA_KNOW_HOW,
    TOOLS
}

data class SectionModel(
    val title: String,
)

data class Section(
    val type: SectionType,
    val model: SectionModel,
    val containers: List<Container>,
    val layout: SectionLayout,
    val style: SectionStyle
)

data class FooterModel(
    val title: String,
    val description: String,
    val imageId: Int,
    val buttonTitle: String,
)

data class Footer(
    val model: FooterModel,
    val style: FooterStyle,
    val layout: FooterLayout
)

data class Screen(
    val sections: List<Section>,
    val footer: Footer,
    val layout: ScreenLayout
)

data class FontDescription(
    val family: Int,
    val weight: FontWeight,
    val size: TextUnit,
    val lineHeight: TextUnit,
    val alignment: TextAlign,
)

data class SectionStyle(
    val titleFont: FontDescription,
)

data class TileStyle(
    val titleFont: FontDescription,
    val descriptionFont: FontDescription?
)

data class FooterStyle(
    val backgroundColor: Color,
    val buttonBackgroundColor: Color,
    val titleFont: FontDescription,
    val descriptionFont: FontDescription,
    val buttonTitleFont: FontDescription
)

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
)

data class ContainerLayout(
    val verticalInterItemSpacing: Dp,
    val horizontalInterItemSpacing: Dp
)

data class SectionLayout(
    val verticalSpacing: Dp
)

data class ScreenLayout(
    val width: Dp,
    val horizontalPadding: Dp,
    val verticalSpacing: Dp
)

data class FooterLayout(
    val padding: Dp,
    val verticalSpacing: Dp,
    val cornerRadius: Dp
)

fun isLight(color: Color): Boolean {
    return luminance(color.toArgb()) > 100
}

@Composable
fun Screen(screen: Screen) {
    val scrollState = rememberScrollState()
    Column(
        verticalArrangement = Arrangement.spacedBy(
            screen.layout.verticalSpacing
        ),
        modifier = Modifier
            .width(screen.layout.width)
            .padding(
                start = screen.layout.horizontalPadding,
                end = screen.layout.horizontalPadding
            )
            .verticalScroll(scrollState)
    ) {
        screen.sections.forEach {
            Section(it)
        }
        Footer(footer = screen.footer)
    }
}

@Composable
fun Section(section: Section) {
    Column(
        verticalArrangement = Arrangement.spacedBy(
            section.layout.verticalSpacing
        )
    ) {
        Text(
            text = section.model.title,
            fontWeight = section.style.titleFont.weight,
            fontFamily = FontFamily(
                Font(section.style.titleFont.family)
            ),
            fontSize = section.style.titleFont.size,
            lineHeight = section.style.titleFont.lineHeight,
            textAlign = section.style.titleFont.alignment,
        )
        FlowRow(
            crossAxisSpacing = section.layout.verticalSpacing
        ) {
            section.containers.forEach {
                when (it.type) {
                    ContainerType.LARGELEFT ->
                        LargeLeftContainerView(container = it)
                    ContainerType.ROW ->
                        RowContainerView(container = it)
                    ContainerType.LARGERIGHT ->
                        LargeRightContainerView(container = it)
                }
            }
        }
    }
}

@Composable
fun LargeLeftContainerView(container: Container) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            container.layout.horizontalInterItemSpacing
        )
    ) {
        BigTileView(
            tile = container.tiles.first()
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(
                container.layout.verticalInterItemSpacing
            )
        ) {
            container.tiles.drop(1).forEach { tile ->
                SmallTileView(
                    tile = tile
                )
            }
        }
    }
}

@Composable
fun LargeRightContainerView(container: Container) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            container.layout.horizontalInterItemSpacing
        )
    ) {
        val layoutNumTilesThreshold = 3
        if (container.tiles.count() < layoutNumTilesThreshold) {
            container.tiles.forEach { tile ->
                SmallTileView(tile = tile)
            }
        } else {
            Column(
                verticalArrangement = Arrangement.spacedBy(
                    container.layout.verticalInterItemSpacing
                )
            ) {
                container.tiles.dropLast(1).forEach { tile ->
                    SmallTileView(
                        tile = tile
                    )
                }
            }
            BigTileView(
                tile = container.tiles.last()
            )
        }
    }
}

@Composable
fun RowContainerView(container: Container) {
    FlowRow(
        crossAxisSpacing = container.layout.horizontalInterItemSpacing,
        mainAxisSpacing = container.layout.verticalInterItemSpacing
    ) {
        container.tiles.forEach { tile ->
            when (tile.type) {
                TileType.BIG -> BigTileView(
                    tile = tile
                )
                TileType.MEDIUM -> MediumTileView(
                    tile = tile
                )
                TileType.SMALL -> SmallTileView(
                    tile = tile
                )
            }
        }
    }
}

@Composable
fun BigTileView(tile: Tile) {
    val foregroundColor = if (isLight(tile.model.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(tile.layout.width)
            .height(tile.layout.height),
        shape = RoundedCornerShape(tile.layout.cornerRadius)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .background(tile.model.backgroundColor)
                .padding(
                    top = tile.layout.topPadding,
                    start = tile.layout.startPadding,
                    end = tile.layout.endPadding,
                    bottom = tile.layout.bottomPadding
                )
        ) {
            Image(
                painter = painterResource(id = tile.model.imageId),
                contentDescription = null,
                // Takes all the height left after the text is placed
                modifier = Modifier.weight(1.0f),
                contentScale = ContentScale.Fit,
                alignment = Alignment.Center
            )
            Spacer(
                modifier = Modifier.defaultMinSize(
                    minHeight = tile.layout.verticalSpacing,
                    minWidth = tile.layout.width
                )
            )
            Column {
                Text(
                    text = tile.model.title,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = tile.style.titleFont.weight,
                    fontFamily = FontFamily(
                        Font(tile.style.titleFont.family)
                    ),
                    fontSize = tile.style.titleFont.size,
                    lineHeight = tile.style.titleFont.lineHeight,
                    textAlign = tile.style.titleFont.alignment,
                )
                Spacer(
                    modifier = Modifier.defaultMinSize(
                        minHeight = tile.layout.textVerticalSpacing,
                        minWidth = tile.layout.width
                    )
                )
                Text(
                    text = tile.model.description,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = tile.style.descriptionFont!!.weight,
                    fontFamily = FontFamily(
                        Font(tile.style.descriptionFont.family)
                    ),
                    fontSize = tile.style.descriptionFont.size,
                    lineHeight = tile.style.descriptionFont.lineHeight,
                    textAlign = tile.style.descriptionFont.alignment,
                )
            }
        }
    }
}

@Composable
fun MediumTileView(tile: Tile) {
    val foregroundColor = if (isLight(tile.model.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(tile.layout.width)
            .height(tile.layout.height),
        shape = RoundedCornerShape(tile.layout.cornerRadius)
    ) {
        Row(
            modifier = Modifier
                .background(tile.model.backgroundColor)
        ) {
            Image(
                painter = painterResource(id = tile.model.imageId),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                alignment = Alignment.Center,
                modifier = Modifier.width(tile.layout.height)
            )
            Column(
                modifier = Modifier.padding(
                    top = tile.layout.textTopPadding,
                    bottom = tile.layout.textBottomPadding,
                    start = tile.layout.textStartPadding,
                    end = tile.layout.textEndPadding
                )
            ) {
                Text(
                    text = tile.model.title,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = tile.style.titleFont.weight,
                    fontFamily = FontFamily(
                        Font(tile.style.titleFont.family)
                    ),
                    fontSize = tile.style.titleFont.size,
                    lineHeight = tile.style.titleFont.lineHeight,
                    textAlign = tile.style.titleFont.alignment,
                )
                Spacer(
                    modifier = Modifier.defaultMinSize(
                        minHeight = tile.layout.textVerticalSpacing,
                        minWidth = tile.layout.width
                    )
                )
                Text(
                    text = tile.model.description,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis,
                    fontWeight = tile.style.descriptionFont!!.weight,
                    fontFamily = FontFamily(
                        Font(tile.style.descriptionFont.family)
                    ),
                    fontSize = tile.style.descriptionFont.size,
                    lineHeight = tile.style.descriptionFont.lineHeight,
                    textAlign = tile.style.descriptionFont.alignment,
                )
            }
        }
    }
}

@Composable
fun SmallTileView(tile: Tile) {
    val foregroundColor = if (isLight(tile.model.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(tile.layout.width)
            .height(tile.layout.height),
        shape = RoundedCornerShape(tile.layout.cornerRadius)
    ) {
        Column(
            modifier = Modifier
                .background(tile.model.backgroundColor)
                .padding(
                    top = tile.layout.topPadding,
                    start = tile.layout.startPadding,
                    end = tile.layout.endPadding,
                    bottom = tile.layout.bottomPadding
                ),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Image(
                painter = painterResource(id = tile.model.imageId),
                contentDescription = null,
                // Takes all the height left after the text is placed
                modifier = Modifier.weight(1.0f),
                contentScale = ContentScale.Fit,
                alignment = Alignment.Center
            )
            Spacer(
                modifier = Modifier.defaultMinSize(
                    minWidth = tile.layout.width,
                    minHeight = tile.layout.verticalSpacing
                )
            )
            Text(
                text = tile.model.title,
                color = foregroundColor,
                overflow = TextOverflow.Ellipsis,
                fontWeight = tile.style.titleFont.weight,
                fontFamily = FontFamily(
                    Font(tile.style.titleFont.family)
                ),
                fontSize = tile.style.titleFont.size,
                lineHeight = tile.style.titleFont.lineHeight,
                textAlign = tile.style.titleFont.alignment,
            )
        }
    }
}

@Composable
fun Footer(footer: Footer) {
    val foregroundColor = if (isLight(footer.style.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    val buttonForegroundColor = if (isLight(footer.style.buttonBackgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        shape = RoundedCornerShape(footer.layout.cornerRadius)
    ) {
        Column(
            verticalArrangement = Arrangement.spacedBy(
                footer.layout.verticalSpacing
            ),
            modifier = Modifier
                .background(footer.style.backgroundColor)
                .padding(
                    top = footer.layout.padding,
                    start = footer.layout.padding,
                    end = footer.layout.padding,
                    bottom = footer.layout.padding
                ),
        ) {
            Text(
                text = footer.model.title,
                color = foregroundColor,
                overflow = TextOverflow.Ellipsis,
                fontWeight = footer.style.titleFont.weight,
                fontFamily = FontFamily(
                    Font(footer.style.titleFont.family)
                ),
                fontSize = footer.style.titleFont.size,
                lineHeight = footer.style.titleFont.lineHeight,
                textAlign = footer.style.titleFont.alignment,
            )
            Text(
                text = footer.model.description,
                color = foregroundColor,
                overflow = TextOverflow.Ellipsis,
                fontWeight = footer.style.descriptionFont.weight,
                fontFamily = FontFamily(
                    Font(footer.style.descriptionFont.family)
                ),
                fontSize = footer.style.descriptionFont.size,
                lineHeight = footer.style.descriptionFont.lineHeight,
                textAlign = footer.style.descriptionFont.alignment,
            )
            Column(
                verticalArrangement = Arrangement.spacedBy(
                    footer.layout.verticalSpacing
                ),
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Image(
                    painter = painterResource(id = footer.model.imageId),
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    alignment = Alignment.Center
                )
                Button(
                    onClick = { /*TODO*/ },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = footer.style.buttonBackgroundColor
                    )
                ) {
                    Text(
                        text = footer.model.buttonTitle,
                        color = buttonForegroundColor,
                        fontWeight = footer.style.buttonTitleFont.weight,
                        fontFamily = FontFamily(
                            Font(footer.style.buttonTitleFont.family)
                        ),
                        fontSize = footer.style.buttonTitleFont.size,
                        lineHeight = footer.style.buttonTitleFont.lineHeight,
                        textAlign = footer.style.buttonTitleFont.alignment,
                    )
                }
            }
        }
    }
}

// DATA

fun yourDataContainers(
    tiles: List<TileModel>,
    layout: ContainerLayout,
    bigTileLayout: TileLayout,
    bigTileStyle: TileStyle,
    smallTileLayout: TileLayout,
    smallTileStyle: TileStyle
): List<Container> {
    val tilesPerContainer = 3
    val chunked = tiles.chunked(tilesPerContainer)

    val containersConfig: List<ContainerType> = listOf(
        ContainerType.LARGELEFT,
        ContainerType.ROW,
        ContainerType.LARGERIGHT,
        ContainerType.ROW
    )

    return chunked.mapIndexed { index, tiles ->
        when (val type = containersConfig[index % containersConfig.count()]) {
            ContainerType.LARGELEFT -> Container(
                type = type,
                tiles = tiles.mapIndexed { index, tileModel ->
                    if (index == 0) {
                        Tile(
                            tileModel,
                            bigTileStyle,
                            bigTileLayout,
                            TileType.BIG
                        )
                    } else {
                        Tile(
                            tileModel,
                            smallTileStyle,
                            smallTileLayout,
                            TileType.SMALL
                        )
                    }
                },
                layout = layout
            )
            ContainerType.ROW -> Container(
                type = type,
                tiles = tiles.map { tileModel ->
                    Tile(
                        tileModel,
                        smallTileStyle,
                        smallTileLayout,
                        TileType.SMALL
                    )
                },
                layout = layout
            )
            ContainerType.LARGERIGHT -> Container(
                type = type,
                tiles = tiles.mapIndexed { index, tileModel ->
                    if (index == tiles.count() - 1) {
                        Tile(
                            tileModel,
                            bigTileStyle,
                            bigTileLayout,
                            TileType.BIG
                        )
                    } else {
                        Tile(
                            tileModel,
                            smallTileStyle,
                            smallTileLayout,
                            TileType.SMALL
                        )
                    }
                },
                layout = layout
            )
        }
    }
}

fun rowContainers(
    tiles: List<TileModel>,
    tilesPerContainer: Int,
    layout: ContainerLayout,
    tileLayout: TileLayout,
    tileStyle: TileStyle,
    tileType: TileType
): List<Container> {
    val chunked = tiles.chunked(tilesPerContainer)

    return chunked.map {
        Container(
            type = ContainerType.ROW,
            layout = layout,
            tiles = it.map { tileModel ->
                Tile(
                    tileModel,
                    tileStyle,
                    tileLayout,
                    tileType
                )
            },
        )
    }
}

fun section(
    model: SectionModel,
    type: SectionType,
    style: SectionStyle,
    tiles: List<TileModel>,
    layout: SectionLayout,
    containerLayout: ContainerLayout,
    smallTileLayout: TileLayout,
    mediumTileLayout: TileLayout,
    bigTileLayout: TileLayout,
    smallTileStyle: TileStyle,
    mediumTileStyle: TileStyle,
    bigTileStyle: TileStyle
): Section {
    when (type) {
        SectionType.YOUR_DATA -> return Section(
            model = model,
            type = type,
            containers = yourDataContainers(
                tiles,
                containerLayout,
                bigTileLayout,
                bigTileStyle,
                smallTileLayout,
                smallTileStyle
            ),
            layout = layout,
            style = style
        )
        SectionType.DATA_KNOW_HOW -> return Section(
            model = model,
            type = type,
            containers = rowContainers(
                tiles,
                tilesPerContainer = 3,
                containerLayout,
                smallTileLayout,
                smallTileStyle,
                TileType.SMALL
            ),
            layout = layout,
            style = style
        )
        SectionType.TOOLS -> return Section(
            model = model,
            type = type,
            containers = rowContainers(
                tiles,
                tilesPerContainer = 1,
                containerLayout,
                mediumTileLayout,
                mediumTileStyle,
                TileType.MEDIUM
            ),
            layout = layout,
            style = style
        )
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    val configuration = LocalConfiguration.current

    val tilesPerContainer = 3

    val screenLayout = ScreenLayout(
        horizontalPadding = PolyStyle().spacing._4x,
        verticalSpacing = PolyStyle().spacing._8x,
        width = configuration.screenWidthDp.dp
    )
    val sectionLayout = SectionLayout(verticalSpacing = PolyStyle().spacing._3x)
    val containerLayout = ContainerLayout(horizontalInterItemSpacing = PolyStyle().spacing._3x, verticalInterItemSpacing = PolyStyle().spacing._3x) // ktlint-disable max-line-length

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing = (tilesPerContainer - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth = (containerWidth - interItemSpacing) / tilesPerContainer // ktlint-disable max-line-length
    val bigTileWidth = containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    val smallTileLayout = TileLayout(
        width = smallTileWidth.dp,
        height = smallTileWidth.dp,
        verticalSpacing = 0.dp,
        topPadding = 0.dp,
        startPadding = PolyStyle().spacing._1x,
        endPadding = PolyStyle().spacing._1x,
        bottomPadding = PolyStyle().spacing._1x,
        cornerRadius = PolyStyle().radius._2x,
        textVerticalSpacing = 0.dp,
        textTopPadding = 0.dp,
        textBottomPadding = 0.dp,
        textStartPadding = 0.dp,
        textEndPadding = 0.dp
    )

    val mediumTileLayout = TileLayout(
        width = containerWidth.dp,
        height = smallTileWidth.dp,
        verticalSpacing = 0.dp,
        topPadding = 0.dp,
        startPadding = 0.dp,
        endPadding = 0.dp,
        bottomPadding = 0.dp,
        cornerRadius = PolyStyle().radius._2x,
        textVerticalSpacing = PolyStyle().spacing._2x,
        textTopPadding = PolyStyle().spacing._2x,
        textBottomPadding = PolyStyle().spacing._2x,
        textStartPadding = PolyStyle().spacing._3x,
        textEndPadding = PolyStyle().spacing._4x
    )

    val bigTileLayout = TileLayout(
        width = bigTileWidth.dp,
        height = bigTileWidth.dp,
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
        textEndPadding = 0.dp
    )

    val sectionStyle = SectionStyle(
        titleFont = FontDescription(
            family = PolyStyle().font.family.jostMedium,
            weight = PolyStyle().font.weight.medium,
            size = PolyStyle().font.size.lg,
            lineHeight = PolyStyle().font.lineHeight.lg,
            alignment = PolyStyle().font.alignment.left
        )
    )

    val smallTileStyle = TileStyle(
        titleFont = FontDescription(
            family = PolyStyle().font.family.jostMedium,
            weight = PolyStyle().font.weight.medium,
            size = PolyStyle().font.size.xs,
            lineHeight = PolyStyle().font.lineHeight.xs,
            alignment = PolyStyle().font.alignment.center
        ),
        descriptionFont = null
    )

    val mediumTileStyle = TileStyle(
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

    val bigTileStyle = TileStyle(
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

    val tileModel = TileModel(
        title = "Facebook Import",
        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
        imageId = R.drawable.ic_launcher,
        backgroundColor = Color.Black
    )

    val tileModels: List<TileModel> = listOf(
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
    )

    val yourDataSection = section(
        model = SectionModel(
            title = "Your Data",
        ),
        type = SectionType.YOUR_DATA,
        tiles = tileModels,
        layout = sectionLayout,
        containerLayout = containerLayout,
        smallTileLayout = smallTileLayout,
        mediumTileLayout = mediumTileLayout,
        bigTileLayout = bigTileLayout,
        smallTileStyle = smallTileStyle,
        mediumTileStyle = mediumTileStyle,
        bigTileStyle = bigTileStyle,
        style = sectionStyle
    )

    val dataKnowHow = section(
        model = SectionModel(
            title = "Data Know How",
        ),
        type = SectionType.DATA_KNOW_HOW,
        tiles = tileModels,
        layout = sectionLayout,
        containerLayout = containerLayout,
        smallTileLayout = smallTileLayout,
        mediumTileLayout = mediumTileLayout,
        bigTileLayout = bigTileLayout,
        smallTileStyle = smallTileStyle,
        mediumTileStyle = mediumTileStyle,
        bigTileStyle = bigTileStyle,
        style = sectionStyle
    )

    val tools = section(
        model = SectionModel(
            title = "Tools",
        ),
        type = SectionType.TOOLS,
        tiles = tileModels,
        layout = sectionLayout,
        containerLayout = containerLayout,
        smallTileLayout = smallTileLayout,
        mediumTileLayout = mediumTileLayout,
        bigTileLayout = bigTileLayout,
        smallTileStyle = smallTileStyle,
        mediumTileStyle = mediumTileStyle,
        bigTileStyle = bigTileStyle,
        style = sectionStyle
    )

    val footer = Footer(
        model = FooterModel(
            title = "Like What You Have Seen?",
            description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
            buttonTitle = "Learn More",
            imageId = R.drawable.ic_launcher
        ),
        style = FooterStyle(
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
        ),
        layout = FooterLayout(
            padding = PolyStyle().spacing._6x,
            verticalSpacing = PolyStyle().spacing._4x,
            cornerRadius = PolyStyle().radius._2x
        )
    )

    val screen = Screen(
        sections = listOf(yourDataSection, dataKnowHow, tools),
        footer = footer,
        layout = screenLayout
    )

    Screen(screen = screen)
    // Footer(footer = footer)
}
