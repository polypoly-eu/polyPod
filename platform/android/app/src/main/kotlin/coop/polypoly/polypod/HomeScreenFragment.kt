package coop.polypoly.polypod

import android.graphics.Bitmap
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.fragment.app.Fragment
import com.google.accompanist.flowlayout.FlowRow
import coop.polypoly.polypod.features.FeatureCategory
import coop.polypoly.polypod.features.FeatureStorage

class HomeScreenFragment : Fragment() {
    private val featureStorage = FeatureStorage()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        featureStorage.importFeatures(requireContext())
        val sectionModels = featureStorage.categories.map { category ->
            SectionModel(
                category.name,
                SectionType.fromCategoryType(category.category),
                category.features.map { feature ->
                    TileModel(
                        feature.name,
                        feature.description,
                        feature.thumbnail,
                        Color(feature.thumbnailColor)
                    )
                }
            )
        }
        return ComposeView(requireContext()).apply {
            setContent {
                Scaffold(
                    topBar = {
                        topBar(onInfoClick = {}, onSettingsClick = {})
                    }
                ) {
                    screen(sectionModels)
                }
            }
        }
    }
}

@Composable
fun topBar(onInfoClick: () -> Unit, onSettingsClick: () -> Unit) {
    TopAppBar(backgroundColor = Color.White) {
        Row(modifier = Modifier
            .fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically) {
            Button(onClick = onInfoClick,
                colors = ButtonDefaults.buttonColors(backgroundColor = Color.White),
                elevation = null) {
                Image(painterResource(R.drawable.ic_info_dark),
                    contentDescription = "info")
            }
            Image(painterResource(R.drawable.ic_logo),
                contentDescription = "logo")
            Button(onClick = onSettingsClick,
                colors = ButtonDefaults.buttonColors(backgroundColor = Color.White),
                elevation = null) {
                Image(painterResource(R.drawable.ic_settings),
                    contentDescription = "settings")
            }
        }
    }
},
}

@Composable
fun screen(sectionModels: List<SectionModel>) {
    val configuration = LocalConfiguration.current

    val tilesPerContainer = 3

    val screenLayout = ScreenLayout(
        horizontalPadding = PolyStyle().spacing._4x,
        verticalSpacing = PolyStyle().spacing._8x,
        width = configuration.screenWidthDp.dp
    )
    val sectionLayout =
        SectionLayout(verticalSpacing = PolyStyle().spacing._3x)
    val containerLayout = ContainerLayout(
        horizontalInterItemSpacing = PolyStyle().spacing._3x,
        verticalInterItemSpacing = PolyStyle().spacing._3x
    ) // ktlint-disable max-line-length

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing =
        (tilesPerContainer - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth =
        (containerWidth - interItemSpacing) / tilesPerContainer // ktlint-disable max-line-length
    val bigTileWidth =
        containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    val smallTileLayout = TileLayout.smallCard(smallTileWidth, smallTileWidth)
    val mediumTileLayout = TileLayout.mediumCard(containerWidth, smallTileWidth)
    val bigTileLayout = TileLayout.bigCard(bigTileWidth, bigTileWidth)

    val sectionStyle = SectionStyle(
        titleFont = FontDescription(
            family = PolyStyle().font.family.jostMedium,
            weight = PolyStyle().font.weight.medium,
            size = PolyStyle().font.size.lg,
            lineHeight = PolyStyle().font.lineHeight.lg,
            alignment = PolyStyle().font.alignment.left
        )
    )

    val smallTileStyle = TileStyle.smallTileStyle()
    val mediumTileStyle = TileStyle.mediumTileStyle()
    val bigTileStyle = TileStyle.bigTileStyle()

    val sections = sectionModels.map {
        section(
            model = it,
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
    }

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
        sections = sections,
        footer = footer,
        layout = screenLayout
    )
    return Screen(screen = screen)
}

enum class TileType {
    SMALL,
    MEDIUM,
    BIG
}

data class TileModel(
    val title: String,
    val description: String,
    val image: Bitmap?,
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
    TOOLS;

    companion object {
        fun fromCategoryType(type: FeatureCategory): SectionType {
            return when (type) {
                FeatureCategory.yourData -> YOUR_DATA
                FeatureCategory.knowHow -> DATA_KNOW_HOW
                FeatureCategory.tools -> TOOLS
            }
        }
    }
}

data class SectionModel(
    val title: String,
    val type: SectionType,
    val tiles: List<TileModel>,
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
) {
    companion object {}
}

fun TileStyle.Companion.smallTileStyle(): TileStyle {
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

fun TileStyle.Companion.mediumTileStyle(): TileStyle {
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

fun TileStyle.Companion.bigTileStyle(): TileStyle {
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
) {
    companion object {}
}

fun TileLayout.Companion.smallCard(width: Float, height: Float): TileLayout {
    return TileLayout(
        width = width.dp,
        height = height.dp,
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
}

fun TileLayout.Companion.mediumCard(width: Float, height: Float): TileLayout {
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
        textTopPadding = PolyStyle().spacing._2x,
        textBottomPadding = PolyStyle().spacing._2x,
        textStartPadding = PolyStyle().spacing._3x,
        textEndPadding = PolyStyle().spacing._4x
    )
}

fun TileLayout.Companion.bigCard(width: Float, height: Float): TileLayout {
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
        textEndPadding = 0.dp
    )
}

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
            tile.model.image?.also {
                Image(
                    bitmap = it.asImageBitmap(),
                    contentDescription = null,
                    // Takes all the height left after the text is placed
                    modifier = Modifier.weight(1.0f),
                    contentScale = ContentScale.Fit,
                    alignment = Alignment.Center
                )
            }
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
            tile.model.image?.also {
                Image(
                    bitmap = it.asImageBitmap(),
                    contentDescription = null,
                    contentScale = ContentScale.Fit,
                    alignment = Alignment.Center,
                    modifier = Modifier.width(tile.layout.height)
                )
            }

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
            tile.model.image?.also {
                Image(
                    bitmap = it.asImageBitmap(),
                    contentDescription = null,
                    // Takes all the height left after the text is placed
                    modifier = Modifier.weight(1.0f),
                    contentScale = ContentScale.Fit,
                    alignment = Alignment.Center
                )
            }
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
    style: SectionStyle,
    layout: SectionLayout,
    containerLayout: ContainerLayout,
    smallTileLayout: TileLayout,
    mediumTileLayout: TileLayout,
    bigTileLayout: TileLayout,
    smallTileStyle: TileStyle,
    mediumTileStyle: TileStyle,
    bigTileStyle: TileStyle
): Section {
    when (model.type) {
        SectionType.YOUR_DATA -> return Section(
            model = model,
            type = model.type,
            containers = yourDataContainers(
                model.tiles,
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
            type =  model.type,
            containers = rowContainers(
                model.tiles,
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
            type =  model.type,
            containers = rowContainers(
                model.tiles,
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

//@Preview(showBackground = true)
//@Composable
//fun DefaultPreview() {
//    val configuration = LocalConfiguration.current
//
//    val tilesPerContainer = 3
//
//    val screenLayout = ScreenLayout(
//        horizontalPadding = PolyStyle().spacing._4x,
//        verticalSpacing = PolyStyle().spacing._8x,
//        width = configuration.screenWidthDp.dp
//    )
//    val sectionLayout = SectionLayout(verticalSpacing = PolyStyle().spacing._3x)
//    val containerLayout = ContainerLayout(horizontalInterItemSpacing = PolyStyle().spacing._3x, verticalInterItemSpacing = PolyStyle().spacing._3x) // ktlint-disable max-line-length
//
//    val screenWidth = configuration.screenWidthDp
//    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
//    val containerWidth = screenWidth - totalScreenPadding
//
//    val interItemSpacing = (tilesPerContainer - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
//    val smallTileWidth = (containerWidth - interItemSpacing) / tilesPerContainer // ktlint-disable max-line-length
//    val bigTileWidth = containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
//
//    val smallTileLayout = TileLayout(
//        width = smallTileWidth.dp,
//        height = smallTileWidth.dp,
//        verticalSpacing = 0.dp,
//        topPadding = 0.dp,
//        startPadding = PolyStyle().spacing._1x,
//        endPadding = PolyStyle().spacing._1x,
//        bottomPadding = PolyStyle().spacing._1x,
//        cornerRadius = PolyStyle().radius._2x,
//        textVerticalSpacing = 0.dp,
//        textTopPadding = 0.dp,
//        textBottomPadding = 0.dp,
//        textStartPadding = 0.dp,
//        textEndPadding = 0.dp
//    )
//
//    val mediumTileLayout = TileLayout(
//        width = containerWidth.dp,
//        height = smallTileWidth.dp,
//        verticalSpacing = 0.dp,
//        topPadding = 0.dp,
//        startPadding = 0.dp,
//        endPadding = 0.dp,
//        bottomPadding = 0.dp,
//        cornerRadius = PolyStyle().radius._2x,
//        textVerticalSpacing = PolyStyle().spacing._2x,
//        textTopPadding = PolyStyle().spacing._2x,
//        textBottomPadding = PolyStyle().spacing._2x,
//        textStartPadding = PolyStyle().spacing._3x,
//        textEndPadding = PolyStyle().spacing._4x
//    )
//
//    val bigTileLayout = TileLayout(
//        width = bigTileWidth.dp,
//        height = bigTileWidth.dp,
//        verticalSpacing = PolyStyle().spacing._2x,
//        topPadding = PolyStyle().spacing._4x,
//        startPadding = PolyStyle().spacing._4x,
//        endPadding = PolyStyle().spacing._4x,
//        bottomPadding = PolyStyle().spacing._4x,
//        cornerRadius = PolyStyle().radius._2x,
//        textVerticalSpacing = 0.dp,
//        textTopPadding = 0.dp,
//        textBottomPadding = 0.dp,
//        textStartPadding = 0.dp,
//        textEndPadding = 0.dp
//    )
//
//    val sectionStyle = SectionStyle(
//        titleFont = FontDescription(
//            family = PolyStyle().font.family.jostMedium,
//            weight = PolyStyle().font.weight.medium,
//            size = PolyStyle().font.size.lg,
//            lineHeight = PolyStyle().font.lineHeight.lg,
//            alignment = PolyStyle().font.alignment.left
//        )
//    )
//
//    val smallTileStyle = TileStyle(
//        titleFont = FontDescription(
//            family = PolyStyle().font.family.jostMedium,
//            weight = PolyStyle().font.weight.medium,
//            size = PolyStyle().font.size.xs,
//            lineHeight = PolyStyle().font.lineHeight.xs,
//            alignment = PolyStyle().font.alignment.center
//        ),
//        descriptionFont = null
//    )
//
//    val mediumTileStyle = TileStyle(
//        titleFont = FontDescription(
//            family = PolyStyle().font.family.jostMedium,
//            weight = PolyStyle().font.weight.medium,
//            size = PolyStyle().font.size.base,
//            lineHeight = PolyStyle().font.lineHeight.base,
//            alignment = PolyStyle().font.alignment.left
//        ),
//        descriptionFont = FontDescription(
//            family = PolyStyle().font.family.jostRegular,
//            weight = PolyStyle().font.weight.regular,
//            size = PolyStyle().font.size.xs,
//            lineHeight = PolyStyle().font.lineHeight.xs,
//            alignment = PolyStyle().font.alignment.left
//        ),
//    )
//
//    val bigTileStyle = TileStyle(
//        titleFont = FontDescription(
//            family = PolyStyle().font.family.jostMedium,
//            weight = PolyStyle().font.weight.medium,
//            size = PolyStyle().font.size.base,
//            lineHeight = PolyStyle().font.lineHeight.base,
//            alignment = PolyStyle().font.alignment.left
//        ),
//        descriptionFont = FontDescription(
//            family = PolyStyle().font.family.jostRegular,
//            weight = PolyStyle().font.weight.regular,
//            size = PolyStyle().font.size.xs,
//            lineHeight = PolyStyle().font.lineHeight.xs,
//            alignment = PolyStyle().font.alignment.left
//        ),
//    )
//
//    val tileModel = TileModel(
//        title = "Facebook Import",
//        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
//        imageId = R.drawable.ic_launcher,
//        backgroundColor = Color.Black
//    )
//
//    val tileModels: List<TileModel> = listOf(
//        tileModel, tileModel, tileModel,
//        tileModel, tileModel, tileModel,
//        tileModel, tileModel, tileModel,
//        tileModel, tileModel, tileModel,
//    )
//
//    val yourDataSection = section(
//        model = SectionModel(
//            title = "Your Data",
//        ),
//        type = SectionType.YOUR_DATA,
//        tiles = tileModels,
//        layout = sectionLayout,
//        containerLayout = containerLayout,
//        smallTileLayout = smallTileLayout,
//        mediumTileLayout = mediumTileLayout,
//        bigTileLayout = bigTileLayout,
//        smallTileStyle = smallTileStyle,
//        mediumTileStyle = mediumTileStyle,
//        bigTileStyle = bigTileStyle,
//        style = sectionStyle
//    )
//
//    val dataKnowHow = section(
//        model = SectionModel(
//            title = "Data Know How",
//        ),
//        type = SectionType.DATA_KNOW_HOW,
//        tiles = tileModels,
//        layout = sectionLayout,
//        containerLayout = containerLayout,
//        smallTileLayout = smallTileLayout,
//        mediumTileLayout = mediumTileLayout,
//        bigTileLayout = bigTileLayout,
//        smallTileStyle = smallTileStyle,
//        mediumTileStyle = mediumTileStyle,
//        bigTileStyle = bigTileStyle,
//        style = sectionStyle
//    )
//
//    val tools = section(
//        model = SectionModel(
//            title = "Tools",
//        ),
//        type = SectionType.TOOLS,
//        tiles = tileModels,
//        layout = sectionLayout,
//        containerLayout = containerLayout,
//        smallTileLayout = smallTileLayout,
//        mediumTileLayout = mediumTileLayout,
//        bigTileLayout = bigTileLayout,
//        smallTileStyle = smallTileStyle,
//        mediumTileStyle = mediumTileStyle,
//        bigTileStyle = bigTileStyle,
//        style = sectionStyle
//    )
//
//    val footer = Footer(
//        model = FooterModel(
//            title = "Like What You Have Seen?",
//            description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
//            buttonTitle = "Learn More",
//            imageId = R.drawable.ic_launcher
//        ),
//        style = FooterStyle(
//            backgroundColor = Color(0xFFFED7D6),
//            buttonBackgroundColor = Color(0xFF0F1938),
//            titleFont = FontDescription(
//                family = PolyStyle().font.family.jostMedium,
//                weight = PolyStyle().font.weight.medium,
//                size = PolyStyle().font.size._2xl,
//                lineHeight = PolyStyle().font.lineHeight._2xl,
//                alignment = PolyStyle().font.alignment.left
//            ),
//            descriptionFont = FontDescription(
//                family = PolyStyle().font.family.jostRegular,
//                weight = PolyStyle().font.weight.regular,
//                size = PolyStyle().font.size.base,
//                lineHeight = PolyStyle().font.lineHeight.base,
//                alignment = PolyStyle().font.alignment.left
//            ),
//            buttonTitleFont = FontDescription(
//                family = PolyStyle().font.family.jostMedium,
//                weight = PolyStyle().font.weight.medium,
//                size = PolyStyle().font.size.lg,
//                lineHeight = PolyStyle().font.lineHeight.lg,
//                alignment = PolyStyle().font.alignment.center
//            )
//        ),
//        layout = FooterLayout(
//            padding = PolyStyle().spacing._6x,
//            verticalSpacing = PolyStyle().spacing._4x,
//            cornerRadius = PolyStyle().radius._2x
//        )
//    )
//
//    val screen = Screen(
//        sections = listOf(yourDataSection, dataKnowHow, tools),
//        footer = footer,
//        layout = screenLayout
//    )
//
//    Screen(screen = screen)
//    // Footer(footer = footer)
//}
