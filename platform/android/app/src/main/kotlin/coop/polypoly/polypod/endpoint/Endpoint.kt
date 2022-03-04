package coop.polypoly.polypod.endpoint

import android.content.Context
import android.content.res.AssetManager
import android.webkit.WebView
import coop.polypoly.polypod.PodApi
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.network.Network
import coop.polypoly.polypod.polyNav.PolyNavObserver
import kotlinx.coroutines.CompletableDeferred
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import kotlinx.serialization.*
import kotlin.coroutines.resume
import kotlin.coroutines.suspendCoroutine

private fun AssetManager.readFile(fileName: String) = open(fileName)
    .bufferedReader()
    .use { it.readText() }

@Serializable
data class EndpointInfo(val url: String, val auth: String)

class Endpoint(
    val context: Context,
    private var observer: EndpointObserver? = null,
    webView: WebView
) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private fun endpointInfofromId(endpointId: String): EndpointInfo? {
        val endpointsPath = "config-assets/endpoints.json"
        val endpointsJsonString = context.assets.readFile(endpointsPath)
        val endpointsJson: HashMap<String, EndpointInfo> =
            Json.decodeFromString(endpointsJsonString)
        return endpointsJson[endpointId]
    }

    open fun setEndpointObserver(newObserver: EndpointObserver) {
        observer = newObserver
    }

    val endpointNetwork = Network(context)
    open suspend fun send(
        endpointId: String,
        featureIdToken: String,
        body: String,
        contentType: String?,
        authorization: String?,
    ): String? {
        val approvalResponse =
            observer?.approveEndpointFetch?.invoke(endpointId) {
                if (it == false) {
                    return@invoke null
                }
                System.out.println("Sup")
                val endpointInfo =
                    endpointInfofromId(endpointId) ?: return@invoke null
                val response = endpointNetwork
                    .httpPost(
                        endpointInfo.url,
                        body,
                        contentType,
                        authorization ?: endpointInfo.auth
                    )
                System.out.println(response)
                return@invoke response
            }
        return approvalResponse
    }

    open suspend fun get(
        endpointId: String,
        featureIdToken: String,
        contentType: String?,
        authorization: String?
    ): String? =
        withContext(Dispatchers.IO) {
            val endpointInfo =
                endpointInfofromId(endpointId) ?: return@withContext null
            val response = endpointNetwork
                .httpGet(
                    endpointInfo.url,
                    contentType,
                    authorization ?: endpointInfo.auth
                )
            return@withContext response
        }
}
