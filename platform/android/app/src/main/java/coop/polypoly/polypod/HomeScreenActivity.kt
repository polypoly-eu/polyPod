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

data class TileConfig(
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

data class ContainerConfig(
    val verticalInterItemSpacing: Dp,
    val horizontalInterItemSpacing: Dp
)

data class HomeScreenConfig(
    val numColumns: Int,
    val horizontalPadding: Dp
)

fun isLight(color: Color): Boolean {
    return luminance(color.toArgb()) > 100
}

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!", modifier = Modifier.height(50.dp))
}

@Composable
fun LargeLeftContainerView(
    tiles: List<Tile>,
    bigTileConfig: TileConfig,
    smallTileConfig: TileConfig,
    containerConfig: ContainerConfig
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            containerConfig.horizontalInterItemSpacing
        )
    ) {
        BigTileView(tile = tiles.first(), config = bigTileConfig)
        Column(
            verticalArrangement = Arrangement.spacedBy(
                containerConfig.verticalInterItemSpacing
            )
        ) {
            tiles.drop(1).forEach {
                SmallTileView(tile = it, config = smallTileConfig)
            }
        }
    }
}

@Composable
fun LargeRightContainerView(
    tiles: List<Tile>,
    bigTileConfig: TileConfig,
    smallTileConfig: TileConfig,
    containerConfig: ContainerConfig,
    homeScreenConfig: HomeScreenConfig
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            containerConfig.horizontalInterItemSpacing
        )
    ) {
        if (tiles.count() < homeScreenConfig.numColumns) {
            tiles.forEach {
                SmallTileView(tile = it, config = smallTileConfig)
            }
        } else {
            Column(
                verticalArrangement = Arrangement.spacedBy(
                    containerConfig.verticalInterItemSpacing
                )
            ) {
                tiles.dropLast(1).forEach {
                    SmallTileView(tile = it, config = smallTileConfig)
                }
            }
            BigTileView(tile = tiles.last(), config = bigTileConfig)
        }
    }
}

@Composable
fun RowContainerView(
    tiles: List<Tile>,
    tileConfig: TileConfig,
    containerConfig: ContainerConfig
) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(
            containerConfig.horizontalInterItemSpacing
        )
    ) {
        tiles.forEach {
            SmallTileView(it, tileConfig)
        }
    }
}

@Composable
fun BigTileView(tile: Tile, config: TileConfig) {
    val foregroundColor = if (isLight(tile.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(config.width)
            .height(config.height),
        shape = RoundedCornerShape(config.cornerRadius)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .background(tile.backgroundColor)
                .padding(
                    top = config.topPadding,
                    start = config.startPadding,
                    end = config.endPadding,
                    bottom = config.bottomPadding
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
                    minHeight = config.verticalSpacing,
                    minWidth = config.width
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
                        minHeight = config.textVerticalSpacing,
                        minWidth = config.width
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
fun SmallTileView(tile: Tile, config: TileConfig) {
    val foregroundColor = if (isLight(tile.backgroundColor)) Color.Black else Color.White // ktlint-disable max-line-length
    Card(
        modifier = Modifier
            .width(config.width)
            .height(config.height),
        shape = RoundedCornerShape(config.cornerRadius)
    ) {
        Column(
            modifier = Modifier
                .background(tile.backgroundColor)
                .padding(
                    top = config.topPadding,
                    start = config.startPadding,
                    end = config.endPadding,
                    bottom = config.bottomPadding
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
                    minWidth = config.width, minHeight = config.verticalSpacing
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

    val homeScreenConfig = HomeScreenConfig(numColumns = 3, horizontalPadding = 8.dp) // ktlint-disable max-line-length
    val containerConfig = ContainerConfig(horizontalInterItemSpacing = 8.dp, verticalInterItemSpacing = 8.dp) // ktlint-disable max-line-length

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * homeScreenConfig.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing = (homeScreenConfig.numColumns - 1) * containerConfig.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth = (containerWidth - interItemSpacing) / homeScreenConfig.numColumns // ktlint-disable max-line-length
    val bigTileWidth = containerWidth - smallTileWidth - containerConfig.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    val smallTileConfig = TileConfig(
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

    val bigTileConfig = TileConfig(
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

    val tile = Tile(
        title = "Facebook Import",
        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
        imageId = R.drawable.ic_launcher,
        backgroundColor = Color.Black
    )

    val tiles = listOf<Tile>(tile, tile, tile)
//
//    RowContainerView(tiles, smallTileConfig, containerConfig)

//    BigTileView(tile = tile, config = bigTileConfig)

//    LargeLeftContainerView(
//        tiles = tiles,
//        bigTileConfig = bigTileConfig,
//        smallTileConfig = smallTileConfig,
//        containerConfig = containerConfig
//    )

    LargeRightContainerView(
        tiles = tiles,
        bigTileConfig = bigTileConfig,
        smallTileConfig = smallTileConfig,
        containerConfig = containerConfig,
        homeScreenConfig = homeScreenConfig
    )
}
