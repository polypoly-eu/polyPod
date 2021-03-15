package coop.polypoly.polypod.features

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class FeatureManifestTest {
    private val manifestString = "{\"name\": \"testManifest\"}"


    @Test
    fun correctManifestParsing_works() {
        val manifest = FeatureManifest(manifestString).getManifest()
        assertThat(manifest.name).isEqualTo("testManifest")
    }

}
