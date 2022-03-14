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

class Network(val context: Context) {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    data class NetworkResponse(var data: String?, var error: String?)

    open suspend fun httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ): NetworkResponse = withContext(Dispatchers.IO) {
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.doOutput = true
        connection.setRequestProperty("charset", "utf-8")
        var response = NetworkResponse(data = null, error = null)

        if (contentType != null)
            connection.setRequestProperty("Content-Type", contentType)

        if (authorization != null) {
            val encodedAuthorization = Base64.encodeToString(
                authorization.toByteArray(StandardCharsets.UTF_8),
                Base64.DEFAULT
            )
            connection.setRequestProperty(
                "Authorization",
                "Basic $encodedAuthorization"
            )
        }

        val encodedBody: ByteArray = body.toByteArray(StandardCharsets.UTF_8)
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
            response.error = exception.toString()
            return@withContext response
        }
        val responseCode = connection.responseCode
        if (responseCode < 200 || responseCode > 299) {
            response.error = "Bad response code: $responseCode"
            logger.error("network.httpPost failed: ${response.error}")
            return@withContext response
        }
        try {
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
        authorization: String?
    ): NetworkResponse = withContext(Dispatchers.IO) {
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.requestMethod = "GET"
        connection.doInput = true
        connection.setRequestProperty("charset", "utf-8")
        var response = NetworkResponse(data = null, error = null)

        if (contentType != null)
            connection.setRequestProperty("Content-Type", contentType)

        if (authorization != null) {
            val encodedAuthorization = Base64.encodeToString(
                authorization.toByteArray(StandardCharsets.UTF_8),
                Base64.DEFAULT
            )
            connection.setRequestProperty(
                "Authorization",
                "Basic $encodedAuthorization"
            )
        }
        val responseCode = connection.responseCode
        if (responseCode < 200 || responseCode > 299) {
            response.error = "Bad response code: $responseCode"
            logger.error("network.httpPost failed: ${response.error}")
            return@withContext response
        }

        try {
            response.data =
                connection.inputStream.bufferedReader().use { it.readText() }
        } finally {
            connection.disconnect()
            return@withContext response
        }
        return@withContext response
    }
}
