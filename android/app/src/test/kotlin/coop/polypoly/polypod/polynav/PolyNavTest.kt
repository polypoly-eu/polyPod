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
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory
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
        polyNav = PolyNav(webView)
    }

    @Ignore
    @Test
    fun `pickFile returns external file object with url selected by the user`
    () = runBlocking {
        val testMap = mutableMapOf<Value, Value>()
        testMap[ValueFactory.newString("url")] =
            ValueFactory.newString(Uri.parse("*").toString())
        testMap[ValueFactory.newString("name")] =
            ValueFactory.newString("testFile.zip")
        testMap[ValueFactory.newString("size")] =
            ValueFactory.newInteger(10020319)
        polyNav.setNavObserver(PolyNavObserver(onPickFile = { testMap }))
        val result = polyNav.pickFile(mimeType)
        assertThat(result).isEqualTo(ValueFactory.newMap(testMap))
    }

    @Test
    fun `pickFile returns null if user cancelled`() = runBlocking {
        polyNav.setNavObserver(PolyNavObserver(onPickFile = { null }))
        val result = polyNav.pickFile(mimeType)
        assertThat(result).isNull()
    }
}
