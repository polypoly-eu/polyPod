package eu.polypoly.pod.android.polyOut

import okhttp3.*
import org.slf4j.LoggerFactory
import java.io.IOException
import kotlin.coroutines.Continuation
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

// TODO - convert to a class and create an instance per Feature
object PolyOut {
    private val client = OkHttpClient()

    suspend fun fetch(uri: String): String =
        suspendCoroutine { continuation ->
            val request = Request.Builder()
                .url(uri)
                .build()

            client.newCall(request).enqueue(FetchCallback(continuation))
        }
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
