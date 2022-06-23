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
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.fragment.app.Fragment
import androidx.navigation.findNavController
import androidx.navigation.fragment.findNavController
import com.google.accompanist.flowlayout.FlowRow
import coop.polypoly.polypod.R

class HomeScreenFragment : Fragment() {
    private val viewModel = HomeScreenViewModel()

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
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
        backgroundColor = Color.Black,
        borderColor = Color.Red
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
        SectionModel("Tools", SectionType.TOOLS, tileModels)
    )
    createScreen(sectionModels = sections)
}
