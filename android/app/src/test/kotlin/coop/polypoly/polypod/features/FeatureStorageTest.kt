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
import java.io.FileOutputStream
import java.util.zip.ZipOutputStream

private fun createMockFeaturePackage(parent: File, child: String): File {
    val featurePackage = File(parent, child)
    ZipOutputStream(FileOutputStream(featurePackage)).close()
    return featurePackage
}

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
        createMockFeaturePackage(featuresDir, "feature1.zip")
        val result = featureStorage.listFeatures(context)
        assertThat(result).hasSize(1)
        assertThat(result.first().name).isEqualTo("feature1")
    }
}
