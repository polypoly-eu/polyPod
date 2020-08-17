package eu.polypoly.pod.android.features

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.LooperMode
import org.slf4j.LoggerFactory
import java.io.File

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
class FeatureWalletTest {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val context: Context = ApplicationProvider.getApplicationContext<Context>()
    private val wallet = FeatureWallet()

    private lateinit var featuresDir: File

    @Before
    fun setup() {
        val mainDir = context.getExternalFilesDir(null)
        featuresDir = File(mainDir, "features")
        featuresDir.mkdirs()
    }

    @Test
    fun whenNoFeaturesAreInstalled_featuresListIsEmpty() {
        val result = wallet.listFeatures(context)
        assertThat(result).isEmpty()
    }

    @Test
    fun whenOneFeatureIsInstalled_featuresListContainsItsName() {
        val featureFile = File(featuresDir, "feature1.zip")
        assertThat(featureFile.createNewFile()).isTrue()
        val result = wallet.listFeatures(context)
        assertThat(result).hasSize(1)
        assertThat(result).containsExactly("feature1")
    }
}
