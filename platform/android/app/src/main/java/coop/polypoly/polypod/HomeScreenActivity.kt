package coop.polypoly.polypod

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.constraintlayout.compose.ConstraintLayout

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
fun SmallCardView() {
    ConstraintLayout(
        modifier = Modifier
            .height(100.dp)
            .width(100.dp)
    ) {
        val (image, text) = createRefs()
        Image(
            painter = painterResource(id = R.drawable.ic_launcher),
            contentDescription = null,
            contentScale = ContentScale.Fit,
            alignment = Alignment.Center,
            modifier = Modifier.constrainAs(image) {
                top.linkTo(parent.top)
                absoluteLeft.linkTo(parent.absoluteLeft)
                absoluteRight.linkTo(parent.absoluteRight)
            }
        )
        Text(
            text = "Some text",
            modifier = Modifier.constrainAs(text) {
                top.linkTo(image.bottom, margin = 10.dp)
                bottom.linkTo(parent.bottom)
                absoluteLeft.linkTo(parent.absoluteLeft)
                absoluteRight.linkTo(parent.absoluteRight)
            }
        )
    }
}

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    SmallCardView()
}
