package eu.polypoly.pod.android.postoffice

import android.text.TextUtils
import android.webkit.WebMessage
import android.webkit.WebMessagePort
import eu.polypoly.bubblewrap.Bubblewrap
import eu.polypoly.bubblewrap.Codec
import eu.polypoly.pod.android.PodApi
import eu.polypoly.pod.android.logging.LoggerFactory
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class PostOfficeMessageCallback(private val coroutineScope: CoroutineScope, private val outerPort: WebMessagePort, private val api: PodApi) : WebMessagePort.WebMessageCallback() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    override fun onMessage(port: WebMessagePort?, message: WebMessage) {
        val data = message.data.split(',').map { Integer.parseInt(it).toByte() }.toByteArray()
        val codec = Codec.id.map()
        val decoded = Bubblewrap.decode(data, codec)

        logger.debug("Decoded string: '{}'", decoded)

        val id = decoded["id"]!!
        val request = decoded["request"]!!.asArrayValue().list()

        coroutineScope.launch {
            val encoded = try {
                val response = api.dispatch(request)
                logger.debug("Got response from api.dispatch: '{}'", response)
                Bubblewrap.encode(mapOf(Pair("response", response), Pair("id", id)), codec)
            } catch (e: Exception) {
                logger.error("Something went wrong with dispatching the request", e)
                Bubblewrap.encode(
                    mapOf(
                        Pair(
                            "error",
                            Codec.string.encode("Something went wrong: ${e.message}")
                        ), Pair("id", id)
                    ), codec
                )
            }
            val raw = TextUtils.join(",", encoded.map { it.toString() })
            outerPort.postMessage(WebMessage(raw))
        }
    }
}
