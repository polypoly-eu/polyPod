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
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.google.accompanist.flowlayout.FlowRow

class HomeScreenActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            Greeting("Android")
        }
    }
}

data class Tile(
    val title: String,
    val description: String,
    val imageId: Int,
    val backgroundColor: Color
)

data class Section(
    val title: String,
    val tiles: List<Tile>
)

data class TileLayout(
    val height: Dp,
    val width: Dp,
    val verticalSpacing: Dp,
    val topPadding: Dp,
    val startPadding: Dp,
    val endPadding: Dp,
    val bottomPadding: Dp,
    val cornerRadius: Dp,
    val textVerticalSpacing: Dp
)

data class ContainerLayout(
    val verticalInterItemSpacing: Dp,
    val horizontalInterItemSpacing: Dp
)

data class SectionLayout(
    val verticalSpacing: Dp
)

data class ScreenLayout(
    val horizontalPadding: Dp
)

data class Layout(
    val smallTile: TileLayout,
    val mediumTile: TileLayout,
    val bigTile: TileLayout,
    val container: ContainerLayout,
    val section: SectionLayout,
    val screen: ScreenLayout
)

data class Config(
    val numColumns: Int,
    val layout: Layout
)

fun isLight(color: Color): Boolean {
    return luminance(color.toArgb()) > 100
}

enum class ContainerType {
    LARGELEFT,
    ROW,
    LARGERIGHT
}

@Composable
fun MyDataSectionView(
    section: Section,
    config: Config
) {

    val containersConfig: List<ContainerType> = listOf(
        ContainerType.LARGELEFT,
        ContainerType.ROW,
        ContainerType.LARGERIGHT,
        ContainerType.ROW
    )

    val chunked = section.tiles.chunked(config.numColumns)

    Column(
        verticalArrangement = Arrangement.spacedBy(
            config.layout.section.verticalSpacing
        )
    ) {
        Text(text = section.title)
        FlowRow(
            crossAxisSpacing = config.layout.section.verticalSpacing
        ) {
            chunked.forEachIndexed { index, tiles ->
                val type = containersConfig[index % containersConfig.count()]
                when (type) {
                    ContainerType.LARGELEFT -> LargeLeftContainerView(
                        tiles = tiles,
                        config = config
                    )
                    ContainerType.ROW -> RowContainerView(
                        tiles = tiles,
                        config = config
                    )
                    ContainerType.LARGERIGHT -> LargeRightContainerView(
                        tiles = tiles,
                        config = config
                    )
                }
            }
        }
    }
}

@Composable
fun DataKnowHowSectionView(
    section: Section,
    config: Config
) {
    val chunked = section.tiles.chunked(config.numColumns)
    Column(
        verticalArrangement = Arrangement.spacedBy(
            config.layout.section.verticalSpacing
        )
    ) {
        Text(text = section.title)
        FlowRow(
            crossAxisSpacing = config.layout.section.verticalSpacing
        ) {
            chunked.forEach {
                RowContainerView(
                    tiles = it,
                    config = config
                )
            }
        }
    }
}

@Composable
fun LargeLeftContainerView(
    tiles: List<Tile>,
    config: Config
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            config.layout.container.horizontalInterItemSpacing
        )
    ) {
        BigTileView(tile = tiles.first(), layout = config.layout.bigTile)
        Column(
            verticalArrangement = Arrangement.spacedBy(
                config.layout.container.verticalInterItemSpacing
            )
        ) {
            tiles.drop(1).forEach {
                SmallTileView(tile = it, layout = config.layout.smallTile)
            }
        }
    }
}

@Composable
fun LargeRightContainerView(
    tiles: List<Tile>,
    config: Config
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            config.layout.container.horizontalInterItemSpacing
        )
    ) {
        if (tiles.count() < config.numColumns) {
            tiles.forEach {
                SmallTileView(tile = it, layout = config.layout.smallTile)
            }
        } else {
            Column(
                verticalArrangement = Arrangement.spacedBy(
                    config.layout.container.verticalInterItemSpacing
                )
            ) {
                tiles.dropLast(1).forEach {
                    SmallTileView(tile = it, layout = config.layout.smallTile)
                }
            }
            BigTileView(tile = tiles.last(), layout = config.layout.bigTile)
        }
    }
}

@Composable
fun RowContainerView(
    tiles: List<Tile>,
    config: Config
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            config.layout.container.horizontalInterItemSpacing
        )
    ) {
        tiles.forEach {
            SmallTileView(it, config.layout.smallTile)
        }
    }
}

@Composable
fun BigTileView(tile: Tile, layout: TileLayout) {
    val foregroundColor = if (isLight(tile.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(layout.width)
            .height(layout.height),
        shape = RoundedCornerShape(layout.cornerRadius)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .background(tile.backgroundColor)
                .padding(
                    top = layout.topPadding,
                    start = layout.startPadding,
                    end = layout.endPadding,
                    bottom = layout.bottomPadding
                )
        ) {
            Image(
                painter = painterResource(id = tile.imageId),
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
                    text = tile.title,
                    textAlign = TextAlign.Start,
                    color = foregroundColor
                )
                Spacer(
                    modifier = Modifier.defaultMinSize(
                        minHeight = layout.textVerticalSpacing,
                        minWidth = layout.width
                    )
                )
                Text(
                    text = tile.description,
                    textAlign = TextAlign.Start,
                    color = foregroundColor
                )
            }
        }
    }
}

@Composable
fun MediumTileView(tile: Tile, layout: TileLayout) {

}

@Composable
fun SmallTileView(tile: Tile, layout: TileLayout) {
    val foregroundColor = if (isLight(tile.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(layout.width)
            .height(layout.height),
        shape = RoundedCornerShape(layout.cornerRadius)
    ) {
        Column(
            modifier = Modifier
                .background(tile.backgroundColor)
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
                painter = painterResource(id = tile.imageId),
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
                text = tile.title,
                textAlign = TextAlign.Center,
                color = foregroundColor
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    val configuration = LocalConfiguration.current

    val numColumns = 3

    val screenLayout = ScreenLayout(horizontalPadding = 8.dp)
    val sectionLayout = SectionLayout(verticalSpacing = 8.dp)
    val containerLayout = ContainerLayout(horizontalInterItemSpacing = 8.dp, verticalInterItemSpacing = 8.dp) // ktlint-disable max-line-length

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing = (numColumns - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth = (containerWidth - interItemSpacing) / numColumns // ktlint-disable max-line-length
    val bigTileWidth = containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    val smallTileLayout = TileLayout(
        height = smallTileWidth.dp,
        width = smallTileWidth.dp,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
        textVerticalSpacing = 0.dp
    )

    val mediumTileLayout = TileLayout(
        height = bigTileWidth.dp,
        width = bigTileWidth.dp,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
        textVerticalSpacing = 8.dp,
    )

    val bigTileLayout = TileLayout(
        height = bigTileWidth.dp,
        width = bigTileWidth.dp,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
        textVerticalSpacing = 8.dp,
    )

    val config = Config(
        numColumns = numColumns,
        layout = Layout(
            smallTile = smallTileLayout,
            mediumTile = mediumTileLayout,
            bigTile = bigTileLayout,
            container = containerLayout,
            section = sectionLayout,
            screen = screenLayout
        )
    )

    val tile = Tile(
        title = "Facebook Import",
        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
        imageId = R.drawable.ic_launcher,
        backgroundColor = Color.Black
    )

    val tiles = listOf<Tile>(tile, tile, tile, tile, tile, tile, tile, tile, tile, tile, tile, tile)

    val section = Section(title = "Data Know How", tiles = tiles)

//    RowContainerView(tiles, config)
//
//    BigTileView(tile, bigTileLayout)
//
//    LargeLeftContainerView(
//        tiles = tiles,
//        config = config
//    )
//
//    LargeRightContainerView(
//        tiles = tiles,
//        config = config
//    )

    MyDataSectionView(
        section = section,
        config = config
    )

//    DataKnowHowSectionView(
//        section = section,
//        config = config
//    )
}
