package coop.polypoly.polypod.endpoint

import android.content.Context
import android.content.res.AssetManager
import com.google.gson.Gson
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.network.Network
import java.lang.Exception

private fun AssetManager.readFile(fileName: String) = open(fileName)
    .bufferedReader()
    .use { it.readText() }

data class EndpointInfo(val url: String, val auth: String)

class Endpoint(
    val context: Context,
    private var observer: EndpointObserver? = null
) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    val endpointNetwork = Network(context)

    private fun endpointInfofromId(endpointId: String): EndpointInfo? {
        val endpointsPath = "config-assets/endpoints.json"
        val endpointsJsonString = context.assets.readFile(endpointsPath)
        val endpointInfoJsonType = object : HashMap<String, EndpointInfo>() {}
        val endpointsJson: HashMap<String, EndpointInfo> = Gson()
            .fromJson(endpointsJsonString, endpointInfoJsonType::class.java)
        return endpointsJson[endpointId]
    }

    private fun endpointErrorMessage(requestType: String): String {
        return "endpoint.$requestType failed"
    }

    open fun setEndpointObserver(newObserver: EndpointObserver) {
        observer = newObserver
    }

    open suspend fun send(
        endpointId: String,
        body: String,
        contentType: String?,
        authToken: String?,
    ) {
        observer?.approveEndpointFetch?.invoke(endpointId) {
            if (!it) {
                logger.error("endpoint.send: User denied request")
                throw Exception(endpointErrorMessage("send"))
            }
            val endpointInfo =
                endpointInfofromId(endpointId)
            if (endpointInfo == null) {
                logger.error(
                    "endpoint.send: No endpoint found under that endpointId"
                )
                throw Exception(endpointErrorMessage("send"))
            }
            val response = endpointNetwork
                .httpPost(
                    endpointInfo.url,
                    body,
                    contentType,
                    authToken ?: endpointInfo.auth
                )
            if (response.error != null) {
                throw Exception(endpointErrorMessage("send"))
            }
            return@invoke null
        }
    }

    open suspend fun get(
        endpointId: String,
        contentType: String?,
        authToken: String?
    ): String {
        val approvalResponse =
            observer?.approveEndpointFetch?.invoke(endpointId) {
                if (!it) {
                    logger.error("endpoint.get: User denied request")
                    throw Exception(endpointErrorMessage("get"))
                }
                val endpointInfo =
                    endpointInfofromId(endpointId)
                if (endpointInfo == null) {
                    logger.error(
                        "endpoint.get: No endpoint found under that endpointId"
                    )
                    throw Exception(endpointErrorMessage("get"))
                }
                val response = endpointNetwork
                    .httpGet(
                        endpointInfo.url,
                        contentType,
                        authToken ?: endpointInfo.auth
                    )
                if (response.error != null) {
                    logger.error("endpoint.get: Has error ${response.error}")
                    throw Exception(endpointErrorMessage("get"))
                }
                return@invoke response.data
            }
        if (approvalResponse == null){
            logger.error("endpoint.get: No response")
            throw Exception(endpointErrorMessage("get"))
        }
        return approvalResponse
    }
}
