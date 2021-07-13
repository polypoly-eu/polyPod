package coop.polypoly.polypod.polynav

import android.webkit.WebView
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import coop.polypoly.polypod.polyNav.PolyNav
import coop.polypoly.polypod.polyNav.PolyNavObserver
import kotlinx.coroutines.runBlocking
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class PolyNavTest {
    private val polyNav: PolyNav

    init {
        val webView = WebView(ApplicationProvider.getApplicationContext())
        polyNav = PolyNav(webView)
    }

    @Test
    fun `pickFile returns file selected by the user`() = runBlocking {
        val fileData = byteArrayOf(0x01, 0x03, 0x03, 0x07)
        polyNav.setNavObserver(PolyNavObserver(onPickFile = { fileData }))
        val result = polyNav.pickFile()
        assertThat(result).isEqualTo(fileData)
    }

    @Test
    fun `pickFile returns null if user cancelled`() = runBlocking {
        polyNav.setNavObserver(PolyNavObserver(onPickFile = { null }))
        val result = polyNav.pickFile()
        assertThat(result).isNull()
    }
}
