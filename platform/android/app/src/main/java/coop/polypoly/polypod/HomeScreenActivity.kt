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

@Composable
fun SmallCardView(
    size: Dp,
    topPadding: Dp,
    otherPadding: Dp,
    verticalSpacing: Dp,
    cornerRadius: Dp
) {
    Card(
        modifier = Modifier
            .width(size)
            .height(size),
        shape = RoundedCornerShape(cornerRadius)
    ) {
        Column(
            modifier = Modifier
                .padding(
                    top = topPadding,
                    start = otherPadding,
                    end = otherPadding,
                    bottom = otherPadding
                ),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Image(
                painter = painterResource(id = R.drawable.ic_launcher),
                contentDescription = null,
                // Takes all the height left after the text is placed
                modifier = Modifier.weight(1.0f),
                contentScale = ContentScale.Fit,
                alignment = Alignment.Center
            )
            Spacer(
                modifier = Modifier.defaultMinSize(
                    minWidth = size, minHeight = verticalSpacing
                )
            )
            Text(
                text = "Facebook Import",
                textAlign = TextAlign.Center
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    val configuration = LocalConfiguration.current
    val interItemSpacing = 8
    val horizontalPadding = 8

    // small card
    val smallCardVerticalSpacing = 8.dp
    val smallCardTopPadding = 8.dp
    val smallCardOtherPadding = 8.dp
    val smallCardCornerRadius = 8.dp

    val size: Dp = (configuration.screenWidthDp / 3 - 2 * interItemSpacing - 2 * horizontalPadding).dp // ktlint-disable max-line-length

    Row(
        modifier = Modifier.padding(horizontalPadding.dp),
        horizontalArrangement = Arrangement.spacedBy(interItemSpacing.dp)
    ) {
        SmallCardView(
            size = size,
            topPadding = smallCardTopPadding,
            otherPadding = smallCardOtherPadding,
            verticalSpacing = smallCardVerticalSpacing,
            cornerRadius = smallCardCornerRadius
        )
        SmallCardView(
            size = size,
            topPadding = smallCardTopPadding,
            otherPadding = smallCardOtherPadding,
            verticalSpacing = smallCardVerticalSpacing,
            cornerRadius = smallCardCornerRadius
        )
        SmallCardView(
            size = size,
            topPadding = smallCardTopPadding,
            otherPadding = smallCardOtherPadding,
            verticalSpacing = smallCardVerticalSpacing,
            cornerRadius = smallCardCornerRadius
        )
    }
}
