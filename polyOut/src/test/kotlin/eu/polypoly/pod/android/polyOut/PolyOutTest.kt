package eu.polypoly.pod.android.polyOut

import com.google.common.truth.Truth.assertThat
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test

class PolyOutTest {

    @Test
    fun simpleGet() = runBlocking {
        val result = PolyOut.fetch("http://httpbin.org/get")
        assertThat(result).contains("\"args\": {}")
    }
}
