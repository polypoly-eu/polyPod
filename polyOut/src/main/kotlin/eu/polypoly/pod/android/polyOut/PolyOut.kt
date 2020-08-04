package eu.polypoly.pod.android.polyOut

import eu.polypoly.fetch.OkFetch
import eu.polypoly.fetch.RequestInit
import kotlinx.coroutines.future.await
import okhttp3.*
import org.slf4j.LoggerFactory
import java.io.IOException
import kotlin.coroutines.Continuation
import kotlin.coroutines.resume

// TODO - convert to a class and create an instance per Feature
object PolyOut {
    private val client = OkFetch(OkHttpClient())

    suspend fun fetch(uri: String): String =
        client.fetch(uri, RequestInit(null, null, null)).await().text().await()
}

private class FetchCallback(private val cont: Continuation<String>) : Callback {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    override fun onFailure(call: Call, e: IOException) {
        logger.error("Err, something went wrong", e)
        cont.resumeWith(Result.failure(e))
    }

    override fun onResponse(call: Call, response: Response) {
        response.use {
            if (!response.isSuccessful) throw IOException("Unexpected code $response")

            for ((name, value) in response.headers) {
                logger.debug("Found header, '{}}': '{}}'", name, value)
            }

            cont.resume(response.body!!.string())
        }
    }
}
