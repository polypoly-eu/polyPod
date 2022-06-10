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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.Button
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.google.accompanist.flowlayout.FlowRow

class HomeScreenActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            // TODO
        }
    }
}

enum class TileType {
    SMALL,
    MEDIUM,
    BIG
}

data class TileModel(
    val title: String,
    val description: String,
    val imageId: Int
)

data class Tile(
    val model: TileModel,
    val style: Style,
    // val fonts: Fonts,
)

enum class ContainerType {
    LARGELEFT,
    ROW,
    LARGERIGHT
}

data class Container(
    val type: ContainerType,
    val tiles: List<Tile>,
    val tileLayout: List<TileLayout>,
    val tileType: List<TileType>,
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
    val layout: SectionLayout
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

data class Fonts(
    val titleFont: Font,
    val descriptionFont: Font
)

data class Style(
    val backgroundColor: Color,
)

data class FooterStyle(
    val backgroundColor: Color,
    val buttonBackgroundColor: Color,
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
    val verticalSpacing: Dp
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
    }
}

@Composable
fun Section(section: Section) {
    Column(
        verticalArrangement = Arrangement.spacedBy(
            section.layout.verticalSpacing
        )
    ) {
        Text(text = section.model.title)
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
            tile = container.tiles.first(),
            layout = container.tileLayout.first()
        )
        Column(
            verticalArrangement = Arrangement.spacedBy(
                container.layout.verticalInterItemSpacing
            )
        ) {
            container.tiles.drop(1).forEachIndexed { index, tile ->
                SmallTileView(
                    tile = tile,
                    layout = container.tileLayout.drop(1)[index]
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
            container.tiles.forEachIndexed { index, tile ->
                SmallTileView(tile = tile, layout = container.tileLayout[index])
            }
        } else {
            Column(
                verticalArrangement = Arrangement.spacedBy(
                    container.layout.verticalInterItemSpacing
                )
            ) {
                container.tiles.dropLast(1).forEachIndexed { index, tile ->
                    SmallTileView(
                        tile = tile,
                        layout = container.tileLayout[index]
                    )
                }
            }
            BigTileView(
                tile = container.tiles.last(),
                layout = container.tileLayout.last()
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
        container.tiles.forEachIndexed { index, tile ->
            when (container.tileType[index]) {
                TileType.BIG -> BigTileView(
                    tile = tile,
                    layout = container.tileLayout[index]
                )
                TileType.MEDIUM -> MediumTileView(
                    tile = tile,
                    layout = container.tileLayout[index]
                )
                TileType.SMALL -> SmallTileView(
                    tile = tile,
                    layout = container.tileLayout[index]
                )
            }
        }
    }
}

@Composable
fun BigTileView(tile: Tile, layout: TileLayout) {
    val foregroundColor = if (isLight(tile.style.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(layout.width)
            .height(layout.height),
        shape = RoundedCornerShape(layout.cornerRadius)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .background(tile.style.backgroundColor)
                .padding(
                    top = layout.topPadding,
                    start = layout.startPadding,
                    end = layout.endPadding,
                    bottom = layout.bottomPadding
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
                    minHeight = layout.verticalSpacing,
                    minWidth = layout.width
                )
            )
            Column() {
                Text(
                    text = tile.model.title,
                    textAlign = TextAlign.Start,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(
                    modifier = Modifier.defaultMinSize(
                        minHeight = layout.textVerticalSpacing,
                        minWidth = layout.width
                    )
                )
                Text(
                    text = tile.model.description,
                    textAlign = TextAlign.Start,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

@Composable
fun MediumTileView(tile: Tile, layout: TileLayout) {
    val foregroundColor = if (isLight(tile.style.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(layout.width)
            .height(layout.height),
        shape = RoundedCornerShape(layout.cornerRadius)
    ) {
        Row(
            modifier = Modifier
                .background(tile.style.backgroundColor)
        ) {
            Image(
                painter = painterResource(id = tile.model.imageId),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                alignment = Alignment.Center,
                modifier = Modifier.width(layout.height)
            )
            Column(
                modifier = Modifier.padding(
                    top = layout.textTopPadding,
                    bottom = layout.textBottomPadding,
                    start = layout.textStartPadding,
                    end = layout.textEndPadding
                )
            ) {
                Text(
                    text = tile.model.title,
                    textAlign = TextAlign.Start,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(
                    modifier = Modifier.defaultMinSize(
                        minHeight = layout.textVerticalSpacing,
                        minWidth = layout.width
                    )
                )
                Text(
                    text = tile.model.description,
                    textAlign = TextAlign.Start,
                    color = foregroundColor,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

@Composable
fun SmallTileView(tile: Tile, layout: TileLayout) {
    val foregroundColor = if (isLight(tile.style.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(layout.width)
            .height(layout.height),
        shape = RoundedCornerShape(layout.cornerRadius)
    ) {
        Column(
            modifier = Modifier
                .background(tile.style.backgroundColor)
                .padding(
                    top = layout.topPadding,
                    start = layout.startPadding,
                    end = layout.endPadding,
                    bottom = layout.bottomPadding
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
                    minWidth = layout.width, minHeight = layout.verticalSpacing
                )
            )
            Text(
                text = tile.model.title,
                textAlign = TextAlign.Center,
                color = foregroundColor,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}

@Composable
fun Footer(footer: Footer) {
    val foregroundColor = if (isLight(footer.style.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card() {
        Column() {
            Text(
                text = footer.model.title,
                textAlign = TextAlign.Start,
                color = foregroundColor,
                overflow = TextOverflow.Ellipsis
            )
            Text(
                text = footer.model.description,
                textAlign = TextAlign.Start,
                color = foregroundColor,
                overflow = TextOverflow.Ellipsis
            )
            Image(
                painter = painterResource(id = footer.model.imageId),
                contentDescription = null,
                contentScale = ContentScale.Fit,
                alignment = Alignment.Center
            )
            Button(onClick = { /*TODO*/ }) {
                Text(text = footer.model.buttonTitle)
            }
        }
    }
}

// DATA

fun yourDataContainers(
    tiles: List<Tile>,
    layout: ContainerLayout,
    bigTileLayout: TileLayout,
    smallTileLayout: TileLayout
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
        val type = containersConfig[index % containersConfig.count()]
        when (type) {
            ContainerType.LARGELEFT -> Container(
                type = type,
                tiles = tiles,
                tileLayout = listOf(
                    bigTileLayout,
                    smallTileLayout,
                    smallTileLayout
                ),
                tileType = listOf(
                    TileType.BIG,
                    TileType.SMALL,
                    TileType.SMALL
                ),
                layout = layout
            )
            ContainerType.ROW -> Container(
                type = type,
                tiles = tiles,
                tileLayout = generateSequence { smallTileLayout }
                    .take(tilesPerContainer).toList(),
                tileType = generateSequence { TileType.SMALL }
                    .take(tilesPerContainer).toList(),
                layout = layout
            )
            ContainerType.LARGERIGHT -> Container(
                type = type,
                tiles = tiles,
                tileLayout = listOf(
                    smallTileLayout,
                    smallTileLayout,
                    bigTileLayout
                ),
                tileType = listOf(
                    TileType.SMALL,
                    TileType.SMALL,
                    TileType.BIG
                ),
                layout = layout
            )
        }
    }
}

fun rowContainers(
    tiles: List<Tile>,
    tilesPerContainer: Int,
    layout: ContainerLayout,
    tileLayout: TileLayout,
    tileType: TileType
): List<Container> {
    val chunked = tiles.chunked(tilesPerContainer)

    return chunked.map {
        Container(
            type = ContainerType.ROW,
            layout = layout,
            tiles = it,
            tileLayout = generateSequence { tileLayout }
                .take(tilesPerContainer).toList(),
            tileType = generateSequence { tileType }
                .take(tilesPerContainer).toList()
        )
    }
}

fun section(
    model: SectionModel,
    type: SectionType,
    tiles: List<Tile>,
    layout: SectionLayout,
    containerLayout: ContainerLayout,
    smallTileLayout: TileLayout,
    mediumTileLayout: TileLayout,
    bigTileLayout: TileLayout
): Section {
    when (type) {
        SectionType.YOUR_DATA -> return Section(
            model = model,
            type = type,
            containers = yourDataContainers(
                tiles,
                containerLayout,
                bigTileLayout,
                smallTileLayout
            ),
            layout = layout
        )
        SectionType.DATA_KNOW_HOW -> return Section(
            model = model,
            type = type,
            containers = rowContainers(
                tiles,
                tilesPerContainer = 3,
                containerLayout,
                smallTileLayout,
                TileType.SMALL
            ),
            layout = layout
        )
        SectionType.TOOLS -> return Section(
            model = model,
            type = type,
            containers = rowContainers(
                tiles,
                tilesPerContainer = 1,
                containerLayout,
                mediumTileLayout,
                TileType.MEDIUM
            ),
            layout = layout
        )
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    val configuration = LocalConfiguration.current

    val tilesPerContainer = 3

    val screenLayout = ScreenLayout(
        horizontalPadding = 8.dp,
        verticalSpacing = 16.dp,
        width = configuration.screenWidthDp.dp
    )
    val sectionLayout = SectionLayout(verticalSpacing = 8.dp)
    val containerLayout = ContainerLayout(horizontalInterItemSpacing = 8.dp, verticalInterItemSpacing = 8.dp) // ktlint-disable max-line-length

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing = (tilesPerContainer - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth = (containerWidth - interItemSpacing) / tilesPerContainer // ktlint-disable max-line-length
    val bigTileWidth = containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    val smallTileLayout = TileLayout(
        width = smallTileWidth.dp,
        height = smallTileWidth.dp,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
        textVerticalSpacing = 0.dp,
        textTopPadding = 0.dp,
        textBottomPadding = 0.dp,
        textStartPadding = 0.dp,
        textEndPadding = 0.dp
    )

    val mediumTileLayout = TileLayout(
        width = containerWidth.dp,
        height = smallTileWidth.dp,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
        textVerticalSpacing = 8.dp,
        textTopPadding = 8.dp,
        textBottomPadding = 8.dp,
        textStartPadding = 8.dp,
        textEndPadding = 8.dp
    )

    val bigTileLayout = TileLayout(
        width = bigTileWidth.dp,
        height = bigTileWidth.dp,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
        textVerticalSpacing = 8.dp,
        textTopPadding = 0.dp,
        textBottomPadding = 0.dp,
        textStartPadding = 0.dp,
        textEndPadding = 0.dp
    )

    val style = Style(
        backgroundColor = Color.Black
    )

    val tileModel = TileModel(
        title = "Facebook Import",
        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
        imageId = R.drawable.ic_launcher,
    )

    val tileModels: List<TileModel> = listOf(
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
    )

    val tiles = tileModels.map {
        Tile(
            model = it,
            style = style
        )
    }

    val yourDataSection = section(
        model = SectionModel(
            title = "Your Data",
        ),
        type = SectionType.YOUR_DATA,
        tiles = tiles,
        layout = sectionLayout,
        containerLayout = containerLayout,
        smallTileLayout = smallTileLayout,
        mediumTileLayout = mediumTileLayout,
        bigTileLayout = bigTileLayout
    )

    val dataKnowHow = section(
        model = SectionModel(
            title = "Data Know How",
        ),
        type = SectionType.DATA_KNOW_HOW,
        tiles = tiles,
        layout = sectionLayout,
        containerLayout = containerLayout,
        smallTileLayout = smallTileLayout,
        mediumTileLayout = mediumTileLayout,
        bigTileLayout = bigTileLayout
    )

    val tools = section(
        model = SectionModel(
            title = "Tools",
        ),
        type = SectionType.TOOLS,
        tiles = tiles,
        layout = sectionLayout,
        containerLayout = containerLayout,
        smallTileLayout = smallTileLayout,
        mediumTileLayout = mediumTileLayout,
        bigTileLayout = bigTileLayout
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
            buttonBackgroundColor = Color(0xFF0F1938)
        ),
        layout = FooterLayout(
            padding = 8.dp,
            verticalSpacing = 8.dp
        )
    )

    val screen = Screen(
        sections = listOf(yourDataSection, dataKnowHow, tools),
        footer = footer,
        layout = screenLayout
    )

    // Screen(screen = screen)
    Footer(footer = footer)
}
