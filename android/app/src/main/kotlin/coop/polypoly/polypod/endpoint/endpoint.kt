package coop.polypoly.polypod.endpoint

import android.content.Context
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.network.Network
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class Endpoint(val context: Context) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }
    val endpointNetwork = Network(context)
    open suspend fun send(
            endpointId: String,
            featureIdToken: String,
            body: String,
            contentType: String?,
            authorization: String?
    ): String? =
            withContext(Dispatchers.IO) {
                val url =
                        "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
                val response = endpointNetwork.httpPost(url, body, contentType, authorization)
                print(response)
                return@withContext response
            }
    open suspend fun get(
            endpointId: String,
            featureIdToken: String,
            contentType: String?,
            authorization: String?
    ): String? =
            withContext(Dispatchers.IO) {
                val url =
                        "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
                val response = endpointNetwork.httpGet(url, contentType, authorization)
                print(response)
                return@withContext response
            }
}
