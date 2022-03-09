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
data class EndpointResponse(var payload: String?, var responseCode: Int)

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
        body: String,
        contentType: String?,
        authorization: String?,
    ): EndpointResponse {
        val approvalResponse =
            observer?.approveEndpointFetch?.invoke(endpointId) {
                if (it == false) {
                    return@invoke EndpointResponse(payload = "User Denied Request", responseCode = 601)
                }
                val endpointInfo =
                    endpointInfofromId(endpointId) ?: return@invoke EndpointResponse(payload = "Endpoint ID Not Found", responseCode = 604)
                val response = endpointNetwork
                    .httpPost(
                        endpointInfo.url,
                        body,
                        contentType,
                        authorization ?: endpointInfo.auth
                    )
                return@invoke EndpointResponse(response.payload, response.responseCode)
            } ?: return EndpointResponse(payload = null, responseCode= 600)
        return approvalResponse
    }

    open suspend fun get(
        endpointId: String,
        contentType: String?,
        authorization: String?
    ): EndpointResponse {
        val approvalResponse =
            observer?.approveEndpointFetch?.invoke(endpointId) {
                if (it == false) {
                    return@invoke EndpointResponse(payload = "User Denied Request", responseCode = 601)
                }
                val endpointInfo =
                    endpointInfofromId(endpointId) ?: return@invoke EndpointResponse(payload = "Endpoint ID Not Found", responseCode = 604)
                val response = endpointNetwork
                    .httpGet(
                        endpointInfo.url,
                        contentType,
                        authorization ?: endpointInfo.auth
                    )
                return@invoke EndpointResponse(response.payload, response.responseCode)
            } ?: return EndpointResponse(payload = null, responseCode= 600)
        return approvalResponse
    }
}
