package coop.polypoly.polypod.polynav

import android.content.Context
import android.net.Uri
import android.webkit.WebView
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import coop.polypoly.polypod.polyNav.PolyNav
import coop.polypoly.polypod.polyNav.PolyNavObserver
import kotlinx.coroutines.runBlocking
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.LooperMode

@LooperMode(LooperMode.Mode.PAUSED)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [Config.OLDEST_SDK])
class PolyNavTest {
    private val polyNav: PolyNav
    private val mimeType = "application/zip"

    init {
        val context: Context = ApplicationProvider.getApplicationContext()
        val webView = WebView(context)
        polyNav = PolyNav(webView, context = context)
    }

    @Ignore
    @Test
    fun `pickFile returns file selected by the user`() = runBlocking {
        val fileData = Uri.parse("*")
        polyNav.setNavObserver(PolyNavObserver(onPickFile = { fileData }))
        val result = polyNav.pickFile(mimeType)
        assertThat(result).isEqualTo(fileData)
    }

    @Test
    fun `pickFile returns null if user cancelled`() = runBlocking {
        polyNav.setNavObserver(PolyNavObserver(onPickFile = { null }))
        val result = polyNav.pickFile()
        assertThat(result).isNull()
    }
}
