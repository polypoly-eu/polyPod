package eu.polypoly.pod.android

import android.content.Context
import android.util.Log
import com.google.android.gms.net.CronetProviderInstaller
import eu.polypoly.bubblewrap.Codec
import eu.polypoly.pod.android.polyOut.FetchRequestCallback
import org.chromium.net.CronetEngine
import org.chromium.net.UrlRequest
import org.msgpack.value.Value
import java.util.concurrent.Executor
import java.util.concurrent.Executors
import kotlin.coroutines.suspendCoroutine

private const val TAG = "PodApi"

// sufficient for now to have just a singleton, later on there should be one PodApi object per Feature
object PodApi {
    private lateinit var cronetEngine: CronetEngine
    private val executor: Executor = Executors.newSingleThreadExecutor()

    fun init(context: Context) {
        CronetProviderInstaller.installProvider(context)
        val cronetEngineBuilder = CronetEngine.Builder(context)
        cronetEngine = cronetEngineBuilder.build()
    }

    private fun decodeCall(value: Value): Pair<String, List<Value>> {
        val map = value.asMapValue().keyValueArray
        return Pair(
            map[1].asStringValue().toString(),
            map[3].asArrayValue().list()
        )
    }

    suspend fun dispatch(value: List<Value>): Value {
        val (outer, _) = decodeCall(value[0])
        if (outer == "polyOut") {
            val (inner, args) = decodeCall(value[1])
            if (inner == "fetch") {
                val result = fetch(args[0].asStringValue().toString())
                val codec =
                    Codec.kvArray(Codec.string, Codec.string).taggedClass("@polypoly-eu/podigree.FetchResponse")
                return codec.encode(mapOf(Pair("bufferedText", result)))
            }
        }

        throw IllegalArgumentException()
    }

    suspend fun fetch(uri: String): String =
        suspendCoroutine { continuation ->
            Log.d(TAG, "Inside PodApi.fetch.suspendCoroutine")
            val requestBuilder = cronetEngine.newUrlRequestBuilder(uri, FetchRequestCallback(continuation), executor)
            val request: UrlRequest = requestBuilder.build()
            request.start()
        }
}
