package coop.polypoly.polypod

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.*
import androidx.compose.material.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
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

@Preview(showBackground = true)
@Composable
fun DefaultPreview() {
    Column {
        Row {
            Text(
                text = "Hello Tim!", modifier = Modifier
                    .height(100.dp)
                    .width(300.dp)
            )
            Column {
                Text(text = "Hello Tim!", modifier = Modifier.height(50.dp))
                Text(text = "Hello Tim!", modifier = Modifier.height(50.dp))
            }
        }

        Row {
            Text(text = "Hello Tim!", modifier = Modifier.height(50.dp))
            Text(text = "Hello Tim!", modifier = Modifier.height(50.dp))
            Text(text = "Hello Tim!", modifier = Modifier.height(50.dp))
        }
    }
}
