package coop.polypoly.polypod.features

import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode


private const val manifestString = """
    {
        "name": "testManifest",
        "description": "testDescription",
        "author": "testAuthor",
        "thumbnail": "assets/thumbnail.png",
        "primaryColor": "#000000",
        "links": {
            "link1": "https://example.com/1",
            "link2": "https://example.com/2"
        }
    }
    """

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class FeatureManifestTest {

    @Test
    fun correctManifestParsing_works() {
        val manifest = FeatureManifest.parse(manifestString)
        assertThat(manifest.name).isEqualTo("testManifest")
        assertThat(manifest.description).isEqualTo("testDescription")
        assertThat(manifest.links["link1"]).isEqualTo(
            "https://example.com/1"
        )
        assertThat(manifest.links["link2"]).isEqualTo(
            "https://example.com/2"
        )
    }

}
