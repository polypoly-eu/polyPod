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

private const val manifestWithTranslationsString = """
    {
        "name": "testManifest",
        "description": "testDescription",
        "author": "testAuthor",
        "translations": {
            "de": {
                "description": "testBeschreibung",
                "author": "testUrheber"
            }
        }
    }
    """

private const val manifestWithTranslatedLinksString = """
    {
        "links": {
            "example": "https://example.com",
            "example-uk": "https://example.co.uk"
        },
        "translations": {
            "de": {
                "links": {
                    "example": "https://example.de"
                }
            }
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
        assertThat(manifest.links?.get("link1")).isEqualTo(
            "https://example.com/1"
        )
        assertThat(manifest.links?.get("link2")).isEqualTo(
            "https://example.com/2"
        )
    }

    @Test
    fun `translated properties work`() {
        val manifest = FeatureManifest.parse(
            manifestWithTranslationsString,
            "de"
        )
        assertThat(manifest.name).isEqualTo("testManifest")
        assertThat(manifest.description).isEqualTo("testBeschreibung")
        assertThat(manifest.author).isEqualTo("testUrheber")
    }

    @Test
    fun `translated links work`() {
        val manifest = FeatureManifest.parse(
            manifestWithTranslatedLinksString,
            "de"
        )
        assertThat(manifest.links?.get("example"))
            .isEqualTo("https://example.de")
        assertThat(manifest.links?.get("example-uk"))
            .isEqualTo("https://example.co.uk")
    }
}
