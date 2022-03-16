package coop.polypoly.polypod.postoffice

import android.util.Base64
import android.webkit.WebMessage
import android.webkit.WebMessagePort
import coop.polypoly.polypod.PodApi
import coop.polypoly.polypod.logging.LoggerFactory
import eu.polypoly.bubblewrap.Bubblewrap
import eu.polypoly.bubblewrap.Codec
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch

class PostOfficeMessageCallback(
    private val coroutineScope: CoroutineScope,
    private val outerPort: WebMessagePort,
    private val api: PodApi
) : WebMessagePort.WebMessageCallback() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    override fun onMessage(port: WebMessagePort?, message: WebMessage) {
        logger.debug("Incoming message from a Feature: '{}'", message.data)
        val data = Base64.decode(message.data, Base64.DEFAULT)
        val codec = Codec.id.map()
        val decoded = Bubblewrap.decode(data, codec)

        logger.debug("Decoded string: '{}'", decoded)

        val id = decoded["id"]!!
        val request = decoded["request"]!!.asArrayValue().list()

        coroutineScope.launch {
            val encoded = try {
                val response = api.dispatch(request)
                logger.debug("Got response from api.dispatch: '{}'", response)
                Bubblewrap.encode(
                    mapOf(
                        Pair("response", response),
                        Pair("id", id)
                    ),
                    codec
                )
            } catch (e: Exception) {
                logger.error(
                    "Something went wrong with dispatching the request",
                    e
                )
                Bubblewrap.encode(
                    mapOf(
                        Pair(
                            "error",
                            Codec.string.encode(
                                "Error dispatching request: " +
                                    e.message
                            )
                        ),
                        Pair("id", id)
                    ),
                    codec
                )
            }
            val raw = Base64.encodeToString(encoded, Base64.NO_WRAP)
            logger.debug("Sending back data to a Feature: '{}'", raw)
            outerPort.postMessage(WebMessage(raw))
        }
    }
}
