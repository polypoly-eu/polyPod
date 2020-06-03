package eu.polypoly.pod.android.polyOut

import android.content.Context
import android.util.Log
import com.google.android.gms.net.CronetProviderInstaller
import org.chromium.net.CronetEngine
import org.chromium.net.UrlRequest
import java.util.concurrent.Executor
import java.util.concurrent.Executors
import kotlin.coroutines.suspendCoroutine

private const val TAG = "polyOut"

object PolyOut {
    private lateinit var cronetEngine: CronetEngine
    private val executor: Executor = Executors.newSingleThreadExecutor()

    fun init(context: Context) {
        CronetProviderInstaller.installProvider(context)
        val cronetEngineBuilder = CronetEngine.Builder(context)
        cronetEngine = cronetEngineBuilder.build()
    }

    suspend fun fetch(uri: String): String =
        suspendCoroutine { continuation ->
            Log.d(TAG, "Inside PodApi.fetch.suspendCoroutine")
            val requestBuilder = cronetEngine.newUrlRequestBuilder(uri, FetchRequestCallback(continuation), executor)
            val request: UrlRequest = requestBuilder.build()
            request.start()
        }
}
