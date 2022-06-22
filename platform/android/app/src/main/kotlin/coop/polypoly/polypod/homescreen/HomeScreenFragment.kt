package coop.polypoly.polypod.homescreen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.compose.foundation.* // ktlint-disable no-wildcard-imports
import androidx.compose.foundation.layout.* // ktlint-disable no-wildcard-imports
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.* // ktlint-disable no-wildcard-imports
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import com.google.accompanist.flowlayout.FlowRow
import coop.polypoly.polypod.HomeScreenFragmentDirections
import coop.polypoly.polypod.R
import coop.polypoly.polypod.luminance

class HomeScreenFragment : Fragment() {
    private val viewModel = HomeScreenViewModel()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val sectionModels = viewModel.getSectionModels {
            findNavController().navigate(
                HomeScreenFragmentDirections
                    .actionHomeScreenFragmentToFeatureFragment(it)
            )
        }
        return ComposeView(requireContext()).apply {
            setContent {
                Scaffold(
                    modifier = Modifier.padding(bottom = 10.dp),
                    topBar = {
                        topBar(onInfoClick = {
                            val direction = HomeScreenFragmentDirections
                                .actionHomeScreenFragmentToOnboardingActivity()
                            findNavController().navigate(direction)
                        }, onSettingsClick = {
                            val direction = HomeScreenFragmentDirections
                                .actionHomeScreenFragmentToSettingsActivity()
                            findNavController().navigate(direction)
                        })
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
        Row(
            modifier = Modifier
                .fillMaxSize(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = onInfoClick,
                colors = ButtonDefaults
                    .buttonColors(backgroundColor = Color.White),
                elevation = null
            ) {
                Image(
                    painterResource(R.drawable.ic_info_dark),
                    contentDescription = "info"
                )
            }
            Image(
                painterResource(R.drawable.ic_logo),
                contentDescription = "logo"
            )
            Button(
                onClick = onSettingsClick,
                colors = ButtonDefaults
                    .buttonColors(backgroundColor = Color.White),
                elevation = null
            ) {
                Image(
                    painterResource(R.drawable.ic_settings),
                    contentDescription = "settings"
                )
            }
        }
    }
}

@Composable
fun screen(sectionModels: List<SectionModel>) {
    val configuration = LocalConfiguration.current
    val tilesPerContainer = 3

    val screenLayout = ScreenLayout.default(configuration.screenWidthDp)
    val containerLayout = ContainerLayout.default()

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing =
        (tilesPerContainer - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth =
        (containerWidth - interItemSpacing) / tilesPerContainer // ktlint-disable max-line-length
    val bigTileWidth =
        containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    val sections = sectionModels.map {
        section(
            model = it,
            layout = SectionLayout.default(),
            containerLayout = ContainerLayout.default(),
            smallTileLayout = TileLayout.smallCard(
                smallTileWidth,
                smallTileWidth
            ),
            mediumTileLayout = TileLayout.mediumCard(
                containerWidth,
                smallTileWidth
            ),
            bigTileLayout = TileLayout.bigCard(bigTileWidth, bigTileWidth),
            smallTileStyle = TileStyle.smallTileStyle(),
            mediumTileStyle = TileStyle.mediumTileStyle(),
            bigTileStyle = TileStyle.bigTileStyle(),
            style = SectionStyle.default()
        )
    }

    val footer = Footer(
        model = FooterModel(
            title = "Like What You Have Seen?",
            description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
            buttonTitle = "Learn More",
            imageId = R.drawable.ic_launcher
        ),
        style = FooterStyle.default(),
        layout = FooterLayout.default()
    )

    val screen = Screen(
        sections = sections,
        footer = footer,
        layout = screenLayout
    )
    return Screen(screen = screen)
}

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
            .height(tile.layout.height)
            .clickable {
                tile.model.onSelection()
            },
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
            .height(tile.layout.height)
            .clickable {
                tile.model.onSelection()
            },
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
            .height(tile.layout.height)
            .clickable {
                tile.model.onSelection()
            },
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
            type = model.type,
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
            type = model.type,
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

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {

    val tileModel = TileModel(
        title = "Facebook Import",
        description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam", // ktlint-disable max-line-length
        image = null,
        backgroundColor = Color.Black
    ) {}

    val tileModels: List<TileModel> = listOf(
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
    )

    val sections: List<SectionModel> = listOf(
        SectionModel("Your Data", SectionType.YOUR_DATA, tileModels),
        SectionModel("Data know how", SectionType.DATA_KNOW_HOW, tileModels),
        SectionModel("Toools", SectionType.TOOLS, tileModels)
    )
    screen(sectionModels = sections)
}
