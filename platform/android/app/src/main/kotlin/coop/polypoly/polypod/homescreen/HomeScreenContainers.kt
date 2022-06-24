package coop.polypoly.polypod.homescreen

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import com.google.accompanist.flowlayout.FlowRow

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
