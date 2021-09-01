package coop.polypoly.polypod.network

import android.content.Context
import coop.polypoly.polypod.logging.LoggerFactory
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
        serverURL: String,
        body: String,
        contentType: String?,
        authorization: String?
    ): Boolean {
        val url = URL(serverURL)
        val connection = url.openConnection() as HttpURLConnection
        val encodedBody: ByteArray = body.toByteArray(StandardCharsets.UTF_8)
        val encodedAuthorization: ByteArray? =
            authorization?.toByteArray(StandardCharsets.UTF_8)

        connection.requestMethod = "POST"
        connection.setRequestProperty("charset", "utf-8")
        connection.setRequestProperty(
            "Content-length",
            encodedBody.size.toString()
        )

        if (contentType != null)
            connection.setRequestProperty("Content-Type", contentType)

        if (encodedAuthorization != null) connection.setRequestProperty(
            "Authorization",
            "Basic $encodedAuthorization"
        )

        try {
            val outputStream: DataOutputStream =
                DataOutputStream(connection.outputStream)
            outputStream.write(encodedBody)
            outputStream.flush()
        } catch (exception: Exception) {
            logger.error("network.httpPost failed: $exception")
            return false
        }

        // TODO: Wait for response and read response code

        return true
    }
}
