package coop.polypoly.polypod.network

import android.content.Context
import android.util.Base64
import coop.polypoly.polypod.logging.LoggerFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.DataOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets

open class Network(val context: Context) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    data class NetworkResponse(var data: String?, var error: String?)

    open suspend fun httpPost(
        url: String,
        body: String,
        contentType: String?,
        authToken: String?
    ): NetworkResponse = withContext(Dispatchers.IO) {
        var response = NetworkResponse(data = null, error = null)
        val connection = httpConnection(
            "POST", url, body, contentType, authToken
        ) ?: return@withContext NetworkResponse(
            null, "network connection failed"
        )
        
        try {
            val responseCode = connection.responseCode
            response.error = validateResponseCode(responseCode)
            response.data =
                connection.inputStream.bufferedReader().use { it.readText() }
        } finally {
            connection.disconnect()
            return@withContext response
        }
        return@withContext response
    }

    open suspend fun httpGet(
        url: String,
        contentType: String?,
        authToken: String?
    ): NetworkResponse = withContext(Dispatchers.IO) {
        var response = NetworkResponse(data = null, error = null)
        val connection = httpConnection(
            "GET", url, null, contentType, authToken
        ) ?: return@withContext NetworkResponse(
            null, "network connection failed"
        )

        try {
            val responseCode = connection.responseCode
            response.error =validateResponseCode(responseCode)
            response.data =
                connection.inputStream.bufferedReader().use { it.readText() }
        } finally {
            connection.disconnect()
            return@withContext response
        }
        return@withContext response
    }

    fun validateResponseCode( responseCode: Int ) : String? {
        if (responseCode < 200 || responseCode > 299) {
            logger.error("network.httpPost failed: Bad response code: $responseCode")
            return "Bad response code: $responseCode"
        }
        return null
    }

    fun httpConnection(
        type: String,
        url: String,
        body: String?,
        contentType: String?,
        authToken: String?,
    ): HttpURLConnection? {
        var connection: HttpURLConnection
        try {
            connection = URL(url).openConnection() as HttpURLConnection
        } catch (exception: Exception) {
            logger.error("network connection failed $exception")
            return null
        }
        connection.requestMethod = type
        if (type == "GET") {
            connection.doOutput = true
        } else {
            connection.doInput = true
        }
        connection.setRequestProperty("charset", "utf-8")

        if (contentType != null)
            connection.setRequestProperty("Content-Type", contentType)

        if (authToken != null) {
            val encodedAuthorization = Base64.encodeToString(
                authToken.toByteArray(StandardCharsets.UTF_8),
                Base64.DEFAULT
            )
            connection.setRequestProperty(
                "Authorization",
                "Basic $encodedAuthorization"
            )
        }
        if (body != null) {
            val encodedBody: ByteArray =
                body.toByteArray(StandardCharsets.UTF_8)
            connection.setRequestProperty(
                "Content-Length",
                encodedBody.size.toString()
            )
            try {
                val outputStream: DataOutputStream =
                    DataOutputStream(connection.outputStream)
                outputStream.write(encodedBody)
                outputStream.flush()
            } catch (exception: Exception) {
                logger.error("network.httpPost failed: $exception")
                return null
            }
        }

        return connection
    }
}
