package coop.polypoly.polypod.homescreen

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.* // ktlint-disable no-wildcard-imports
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.Button
import androidx.compose.material.ButtonDefaults
import androidx.compose.material.Card
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextOverflow
import coop.polypoly.polypod.luminance

fun isLight(color: Color): Boolean {
    return luminance(color.toArgb()) > 100
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
                .border(
                    width = tile.layout.borderWidth,
                    color = tile.model.borderColor,
                    shape = RoundedCornerShape(tile.layout.cornerRadius)
                )
                .padding(
                    top = tile.layout.topPadding,
                    start = tile.layout.startPadding,
                    end = tile.layout.endPadding,
                    bottom = tile.layout.bottomPadding,
                ),
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
                    text = "",
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
                .border(
                    width = tile.layout.borderWidth,
                    color = tile.model.borderColor,
                    shape = RoundedCornerShape(tile.layout.cornerRadius)
                )
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
                .border(
                    width = tile.layout.borderWidth,
                    color = tile.model.borderColor,
                    shape = RoundedCornerShape(tile.layout.cornerRadius)
                )
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
