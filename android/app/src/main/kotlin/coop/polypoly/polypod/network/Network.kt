package coop.polypoly.polypod.network

import android.content.Context
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

    open suspend fun httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ): Boolean = withContext(Dispatchers.IO) {
        val connection = URL(url).openConnection() as HttpURLConnection
        connection.requestMethod = "POST"
        connection.doOutput = true
        connection.setRequestProperty("charset", "utf-8")

        if (contentType != null)
            connection.setRequestProperty("Content-Type", contentType)

        val encodedAuthorization: ByteArray? =
            authorization?.toByteArray(StandardCharsets.UTF_8)
        if (encodedAuthorization != null) connection.setRequestProperty(
            "Authorization",
            "Basic $encodedAuthorization"
        )

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
            return@withContext false
        }

        val responseCode = connection.responseCode
        if (responseCode < 200 || responseCode > 299) {
            logger.error("network.httpPost: Bad response code: $responseCode")
            return@withContext false
        }

        return@withContext true
    }
}
