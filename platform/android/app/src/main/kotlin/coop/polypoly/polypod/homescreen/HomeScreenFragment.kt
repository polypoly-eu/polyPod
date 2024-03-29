package coop.polypoly.polypod.homescreen

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.compose.foundation.* // ktlint-disable no-wildcard-imports
import androidx.compose.foundation.layout.* // ktlint-disable no-wildcard-imports
import androidx.compose.material.* // ktlint-disable no-wildcard-imports
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.ComposeView
import androidx.compose.ui.platform.LocalConfiguration
import androidx.compose.ui.res.colorResource
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.testTag
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.tooling.preview.Preview
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import com.google.accompanist.flowlayout.FlowRow
import coop.polypoly.core.FeatureCategoryId
import coop.polypoly.polypod.R
import kotlin.math.floor
import kotlin.math.max
import kotlin.math.min

class HomeScreenFragment : Fragment() {
    private val viewModel = HomeScreenViewModel()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        val sectionModels = viewModel.getSectionModels(requireContext()) {
            findNavController().navigate(
                HomeScreenFragmentDirections
                    .actionHomeScreenFragmentToFeatureFragment(it)
            )
        }
        return ComposeView(requireContext()).apply {
            setContent {
                Scaffold(
                    modifier = Modifier.semantics { testTag = "HomeScreen" },
                    topBar = {
                        topBar(
                            onInfoClick = {
                                val direction = HomeScreenFragmentDirections
                                    .actionHomeScreenFragmentToOnboardingActivity() // ktlint-disable max-line-length
                                findNavController().navigate(direction)
                            },
                            onSettingsClick = {
                                val direction = HomeScreenFragmentDirections
                                    .actionHomeScreenFragmentToSettingsActivity() // ktlint-disable max-line-length
                                findNavController().navigate(direction)
                            }
                        )
                    }
                ) {
                    createScreen(sectionModels)
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
fun createScreen(sectionModels: List<SectionModel>) {
    val configuration = LocalConfiguration.current
    val tilesPerContainer = 3

    val screenLayout = ScreenLayout.default(configuration.screenWidthDp)
    val containerLayout = ContainerLayout.default()

    val screenWidth = configuration.screenWidthDp
    val totalScreenPadding = 2 * screenLayout.horizontalPadding.value
    val containerWidth = screenWidth - totalScreenPadding

    val interItemSpacing =
        (tilesPerContainer - 1) * containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length
    val smallTileWidth = floor(
        (containerWidth - interItemSpacing) / tilesPerContainer
    )
    val bigTileWidth =
        containerWidth - smallTileWidth - containerLayout.horizontalInterItemSpacing.value // ktlint-disable max-line-length

    // FIX: Tiles become large on bigger screens. Text remains small
    // Solution: Scale up the text size.
    // text fits well when the small tile is 112
    val baseSmallTileWidth = 112
    val multiplier = max(1.0f, min(2.0f, smallTileWidth / baseSmallTileWidth))

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
                smallTileWidth,
                multiplier
            ),
            bigTileLayout = TileLayout.bigCard(bigTileWidth, bigTileWidth),
            smallTileStyle = TileStyle.smallTileStyle(multiplier),
            mediumTileStyle = TileStyle.mediumTileStyle(multiplier),
            bigTileStyle = TileStyle.bigTileStyle(multiplier),
            style = SectionStyle.default(multiplier)
        )
    }

    val footer = Footer(
        model = FooterModel(
            title = stringResource(
                R.string.homescreen_footer_title
            ),
            description = stringResource(
                R.string.homescreen_footer_description
            ),
            buttonTitle = stringResource(
                R.string.homescreen_footer_button_title
            )
        ),
        style = FooterStyle.default(multiplier),
        layout = FooterLayout.default()
    )

    val screen = Screen(
        sections = sections,
        footer = footer,
        layout = screenLayout
    )
    return Screen(screen = screen)
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
            .background(colorResource(R.color.homescreen_background))
            .verticalScroll(scrollState)
            .padding(
                start = screen.layout.horizontalPadding,
                end = screen.layout.horizontalPadding,
                bottom = screen.layout.verticalSpacing
            )

    ) {
        Spacer(
            modifier = Modifier.defaultMinSize(
                minWidth = screen.layout.width
            )
        )
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
            textAlign = section.style.titleFont.alignment
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
    when (model.id) {
        FeatureCategoryId.yourData -> return Section(
            model = model,
            id = model.id,
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
        FeatureCategoryId.knowHow -> return Section(
            model = model,
            id = model.id,
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
        FeatureCategoryId.tools -> return Section(
            model = model,
            id = model.id,
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
        FeatureCategoryId.developer -> return Section(
            model = model,
            id = model.id,
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
        backgroundColor = Color.Black,
        borderColor = Color.Red,
        tileTextColor = Color.White
    ) {}

    val tileModels: List<TileModel> = listOf(
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel,
        tileModel, tileModel, tileModel
    )

    val sections: List<SectionModel> = listOf(
        SectionModel("Your Data", FeatureCategoryId.yourData, tileModels),
        SectionModel("Data know how", FeatureCategoryId.knowHow, tileModels),
        SectionModel("Tools", FeatureCategoryId.tools, tileModels)
    )
    createScreen(sectionModels = sections)
}
