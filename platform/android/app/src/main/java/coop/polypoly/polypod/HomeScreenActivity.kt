package coop.polypoly.polypod

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Card
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
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

@Composable
fun Greeting(name: String) {
    Text(text = "Hello $name!", modifier = Modifier.height(50.dp))
}

/*
struct RowContainerView: View {
    let cards: [Card]
    var body: some View {
        HStack(alignment: .top, spacing: HomeScreenConstants.TileContainer.horizontalSpacing) {
            ForEach(cards) { card in
                SmallCardView(card: card)
            }
            if (cards.count < HomeScreenConstants.TileContainer.numberOfColumns) {
                Spacer()
            }
        }
    }
}


struct Card: Identifiable {
    let id: FeatureId
    let title: String
    let description: String
    let image: UIImage
    let backgroundColor: Color
}
 */

data class Tile(
    val title: String,
    val description: String,
    val imageId: Int,
    val backgroundColor: Color
)

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
fun SmallTileView(tile: Tile, config: TileConfig) {
    // TODO: background color
    Card(
        modifier = Modifier
            .width(config.width)
            .height(config.height),
        shape = RoundedCornerShape(config.cornerRadius)
    ) {
        Column(
            modifier = Modifier
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
                textAlign = TextAlign.Center
            )
        }
    }
}

data class TileConfig(
    val height: Dp,
    val width: Dp,
    val verticalSpacing: Dp,
    val topPadding: Dp,
    val startPadding: Dp,
    val endPadding: Dp,
    val bottomPadding: Dp,
    val cornerRadius: Dp
)

data class ContainerConfig(
    val horizontalInterItemSpacing: Dp
)

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    val configuration = LocalConfiguration.current
    val interItemSpacing = 8
    val horizontalPadding = 8

    val size: Dp = (configuration.screenWidthDp / 3 - 2 * interItemSpacing - 2 * horizontalPadding).dp // ktlint-disable max-line-length

    val smallCardConfig = TileConfig(
        height = size,
        width = size,
        verticalSpacing = 8.dp,
        topPadding = 8.dp,
        startPadding = 8.dp,
        endPadding = 8.dp,
        bottomPadding = 8.dp,
        cornerRadius = 8.dp,
    )

    val containerConfig = ContainerConfig(horizontalInterItemSpacing = 8.dp)

    val tile = Tile(
        title = "Facebook Import",
        description = "",
        imageId = R.drawable.ic_launcher,
        backgroundColor = Color.White
    )

    val tiles = listOf<Tile>(tile, tile, tile)

    RowContainerView(tiles, smallCardConfig, containerConfig)
}
