package coop.polypoly.polypod.features

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
import java.io.File

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class FeatureStorageTest {
    private val context: Context = ApplicationProvider.getApplicationContext()
    private val featureStorage = FeatureStorage()

    private lateinit var featuresDir: File

    @Before
    fun setup() {
        val mainDir = context.filesDir
        featuresDir = File(mainDir, "features")
        featuresDir.mkdirs()
    }

    @Test
    fun whenNoFeaturesAreInstalled_featuresListIsEmpty() {
        val result = featureStorage.listFeatures(context)
        assertThat(result).isEmpty()
    }

    @Test
    fun whenOneFeatureIsInstalled_featuresListContainsItsName() {
        val featureFile = File(featuresDir, "feature1.zip")
        assertThat(featureFile.createNewFile()).isTrue()
        val result = featureStorage.listFeatures(context)
        assertThat(result).hasSize(1)
        assertThat(result.first().name).isEqualTo("feature1")
    }
}
