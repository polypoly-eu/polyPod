package coop.polypoly.polypod.api.polyout

import android.content.Context
import android.net.Uri
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.google.common.truth.Truth
import coop.polypoly.polypod.FeatureStorage
import coop.polypoly.polypod.api.polyOut.PolyOut
import coop.polypoly.polypod.util.FakeAesKeyGenerator
import coop.polypoly.polypod.util.FakeKeyStore
import kotlinx.coroutines.runBlocking
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Shadows
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode
import java.io.File
import java.io.InputStream
import java.security.Provider
import java.security.Security

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class PolyOutTest {

    private val polyOut: PolyOut by lazy {
        PolyOut(
            context = context
        )
    }
    private val context: Context by lazy {
        InstrumentationRegistry.getInstrumentation().targetContext
    }
    private val resolver by lazy { Shadows.shadowOf(context.contentResolver) }

    private fun path(resource: String): String {
        return InstrumentationRegistry
            .getInstrumentation()
            .javaClass.classLoader!!
            .getResource(resource)
            .toString()
    }

    private fun inputStream(resource: String): InputStream {
        return InstrumentationRegistry
            .getInstrumentation()
            .javaClass.classLoader!!
            .getResource(resource)
            .openStream()
    }

    @Before
    fun setup() {
        Security.addProvider(object : Provider("AndroidKeyStore", 1.0, "") {
            init {
                put("KeyStore.AndroidKeyStore", FakeKeyStore::class.java.name)
                put("KeyGenerator.AES", FakeAesKeyGenerator::class.java.name)
            }
        })

        val mainDir = context.filesDir
        val featuresDir = File(mainDir, "features")
        featuresDir.mkdirs()

        FeatureStorage.activeFeatureId = "Id"
    }

    @Test
    fun importOneArchiveWorks() {
        val url = path("testZip.zip")
        val inputStream = inputStream("testZip.zip")
        resolver.registerInputStream(Uri.parse(url), inputStream)

        val zipId = runBlocking {
            polyOut.importArchive(url = url)
        }

        Truth.assertThat(zipId).isNotEmpty()

        val files = runBlocking {
            polyOut.readDir(zipId!!)
        }

        Truth.assertThat(files).isNotEmpty()
        val hasFile = files.any {
            it["path"] == "testZip/testfile.rtf"
        }
        Truth.assertThat(hasFile).isTrue()
    }

    @Test
    fun importMultipleArchivesWorks() {
        val url1 = path("multipleZips1.zip")
        val inputStream1 = inputStream("multipleZips1.zip")
        val url2 = path("multipleZips2.zip")
        val inputStream2 = inputStream("multipleZips2.zip")
        resolver.registerInputStream(Uri.parse(url1), inputStream1)
        resolver.registerInputStream(Uri.parse(url2), inputStream2)

        val zipId1 = runBlocking {
            polyOut.importArchive(url = url1)
        }

        Truth.assertThat(zipId1).isNotEmpty()

        val zipId2 = runBlocking {
            polyOut.importArchive(url = url2, zipId1)
        }

        Truth.assertThat(zipId2).isNotEmpty()
        Truth.assertThat(zipId1).isEqualTo(zipId2)

        val files = runBlocking {
            polyOut.readDir(zipId1!!)
        }

        Truth.assertThat(files).isNotEmpty()

        val hasFile1 = files.any {
            it["path"] == "multipleZips1/file1.rtf"
        }
        val hasFile2 = files.any {
            it["path"] == "multipleZips2/file2.rtf"
        }

        Truth.assertThat(hasFile1).isTrue()
        Truth.assertThat(hasFile2).isTrue()
    }
}
