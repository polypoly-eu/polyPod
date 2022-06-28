package coop.polypoly.polypod.features

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import org.junit.Before
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

private const val manifestString = """
    {
        "name": "testManifest",
        "description": "testDescription",
        "author": "testAuthor",
        "thumbnail": "assets/thumbnail.png",
        "primaryColor": "#000000",
        "borderColor": "#000000",
        "textColor": "#000000",
        "links": {
            "link1": "https://example.com/1",
            "link2": "https://example.com/2"
        }
    }
    """

private fun createMockFeaturePackage(parent: File, child: String): File {
    val featurePackage = File(parent, child)
    ZipOutputStream(FileOutputStream(featurePackage)).use { zipOut ->
        zipOut.putNextEntry(ZipEntry("manifest.json"))
        zipOut.write(manifestString.toByteArray())
        zipOut.closeEntry()
    }
    return featurePackage
}

@Ignore(
    """

            Currently there are some issues with loading the core JNI
            into JUnit to run tests below. Since the whole logic of reading the
            categories will move to core thus tested there, just ignore this
            test suite.
        """
)
@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class FeatureStorageTest {
    private val context: Context = ApplicationProvider.getApplicationContext()

    private lateinit var featuresDir: File

    @Before
    fun setup() {
        val mainDir = context.filesDir
        featuresDir = File(mainDir, "features")
        featuresDir.mkdirs()
    }

    @Test
    fun whenNoFeaturesAreInstalled_featuresListIsEmpty() {
        FeatureStorage.importFeatures(context)
        assertThat(FeatureStorage.categories).isEmpty()
    }

    @Test
    @Ignore(
        """
            Features not in the order file are currently being ignored, mock \
            data needs updating
        """
    )
    fun whenOneFeatureIsInstalled_featuresListContainsItsName() {
        createMockFeaturePackage(featuresDir, "feature1.zip")
        FeatureStorage.importFeatures(context)
        val features = FeatureStorage.categories[0].features
        assertThat(features).hasSize(1)
        assertThat(features.first().name).isEqualTo("testManifest")
    }
}
