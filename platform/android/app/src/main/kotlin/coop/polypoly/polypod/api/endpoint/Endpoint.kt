package coop.polypoly.polypod.api.endpoint

import android.content.Context
import android.content.res.AssetManager
import com.google.gson.Gson
import coop.polypoly.polypod.api.PodApiError
import coop.polypoly.polypod.logging.LoggerFactory

private fun AssetManager.readFile(fileName: String) = open(fileName)
    .bufferedReader()
    .use { it.readText() }

data class EndpointInfo(
    val url: String,
    val auth: String,
    val allowInsecure: Boolean
)

class Endpoint(
    val context: Context,
    private var observer: EndpointObserver? = null
) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val endpointNetwork = Network(context)

    private fun endpointInfoFromId(endpointId: String): EndpointInfo? {
        val endpointsPath = "config-assets/endpoints.json"
        val endpointsJsonString = context.assets.readFile(endpointsPath)
        val endpointInfoJsonType = object : HashMap<String, EndpointInfo>() {}
        val endpointsJson: HashMap<String, EndpointInfo> = Gson()
            .fromJson(endpointsJsonString, endpointInfoJsonType::class.java)
        return endpointsJson[endpointId]
    }

    suspend fun uploadError(
        endpointId: String,
        errorMsg: String
    ) {
        if (errorMsg.isEmpty()) {
            logger.error(
                "uploadError: No payload found."
            )
            throw PodApiError().endpointError()
        }

        val endpoint = Endpoint(context)

        val endpointInfo = endpoint.endpointInfoFromId(endpointId)
        if (endpointInfo == null) {
            logger.error(
                "uploadError: No endpoint found under that endpointId"
            )
            throw PodApiError().endpointError()
        }

        val jsonString = "{ \"error\": \"$errorMsg\" }"
        val payload = Gson().toJson(jsonString)

        try {
            endpointNetwork
                .httpPost(
                    endpointInfo.url,
                    payload,
                    "application/json; charset=utf-8",
                    endpointInfo.auth,
                    endpointInfo.allowInsecure
                )
        } catch (e: PodApiError) {
            logger.error("uploadError - Failed: $e")
            throw PodApiError().endpointError()
        }
    }

    fun setEndpointObserver(newObserver: EndpointObserver) {
        observer = newObserver
    }

    suspend fun send(
        endpointId: String,
        body: String,
        contentType: String?,
        authToken: String?,
    ) {
        observer?.approveEndpointFetch?.invoke(endpointId) {
            if (!it) {
                logger.error("endpoint.send: User denied request")
                throw PodApiError().userDeniedPermission()
            }
            val endpointInfo =
                endpointInfoFromId(endpointId)
            if (endpointInfo == null) {
                logger.error(
                    "endpoint.send: No endpoint found under that endpointId"
                )
                throw PodApiError().endpointError()
            }
            val response = endpointNetwork
                .httpPost(
                    endpointInfo.url,
                    body,
                    contentType,
                    authToken ?: endpointInfo.auth,
                    endpointInfo.allowInsecure
                )
            if (response.error != null) {
                throw PodApiError().endpointError()
            }
            return@invoke null
        }
    }

    suspend fun get(
        endpointId: String,
        contentType: String?,
        authToken: String?
    ): String {
        val approvalResponse =
            observer?.approveEndpointFetch?.invoke(endpointId) {
                if (!it) {
                    logger.error("endpoint.get: User denied request")
                    throw PodApiError().userDeniedPermission()
                }
                val endpointInfo =
                    endpointInfoFromId(endpointId)
                if (endpointInfo == null) {
                    logger.error(
                        "endpoint.get: No endpoint found under that endpointId"
                    )
                    throw PodApiError().endpointError()
                }
                val response = endpointNetwork
                    .httpGet(
                        endpointInfo.url,
                        contentType,
                        authToken ?: endpointInfo.auth,
                        endpointInfo.allowInsecure
                    )
                if (response.error != null) {
                    logger.error("endpoint.get: Has error ${response.error}")
                    throw PodApiError().endpointError()
                }
                return@invoke response.data
            }
        if (approvalResponse == null) {
            logger.error("endpoint.get: No response")
            throw PodApiError().endpointError()
        }
        return approvalResponse
    }
}
