package eu.polypoly.pod.android.polyOut

import android.util.Log
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.google.common.truth.Truth.assertThat
import kotlinx.coroutines.runBlocking
import org.junit.BeforeClass
import org.junit.Test
import org.junit.runner.RunWith

const val TAG = "PolyOutTest"

@RunWith(AndroidJUnit4::class)
class PolyOutTest {

    companion object {
        @BeforeClass
        @JvmStatic
        fun setUp() {
            System.setProperty("javax.net.ssl.trustStore", "NONE")  // see https://github.com/robolectric/robolectric/issues/5115
        }
    }

    @Test
    fun simpleGet() = runBlocking {
        val result = PolyOut.fetch("http://httpbin.org/get")
        Log.i(TAG, "Got result: '${result}'")
        assertThat(result).contains("\"args\": {}")
    }
}
