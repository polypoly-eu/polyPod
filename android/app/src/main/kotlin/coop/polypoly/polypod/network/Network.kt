package coop.polypoly.polypod.network

import android.content.Context
import java.io.DataOutputStream
import java.net.HttpURLConnection
import java.net.URL
import java.nio.charset.StandardCharsets


class Network (
    val context: Context
    ){
    open suspend fun httpPost(serverURL: String, contentType: String, body: String, authorization: String?) {

        val url = URL(serverURL)
        val connection = url.openConnection() as HttpURLConnection
        val encodedBody: ByteArray = body.toByteArray(StandardCharsets.UTF_8)
        val encodedAuthorization: ByteArray? = authorization?.toByteArray(StandardCharsets.UTF_8)

        connection.requestMethod = "POST"
        connection.setRequestProperty("charset", "utf-8")
        connection.setRequestProperty(
            "Content-length",
            encodedBody.size.toString()
        )
        connection.setRequestProperty("Content-Type", contentType)
        if (encodedAuthorization != null) connection.setRequestProperty("Authorization",
            "Basic $encodedAuthorization"
        )

        try {
            val outputStream: DataOutputStream =
                DataOutputStream(connection.outputStream)
            outputStream.write(encodedBody)
            outputStream.flush()
        } catch (exception: Exception) {

        }

    }
}
