package eu.polypoly.pod.android

import android.net.Uri
import android.os.Bundle
import android.text.TextUtils
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import android.webkit.WebMessagePort.WebMessageCallback
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import androidx.webkit.WebViewAssetLoader.ResourcesPathHandler
import eu.polypoly.bubblewrap.Bubblewrap
import eu.polypoly.bubblewrap.Codec
import kotlinx.coroutines.launch

/**
 * A simple [Fragment] subclass as the second destination in the navigation.
 */
class SecondFragment : Fragment() {

    private val api: PodApi = PodApi
    private lateinit var webView: WebView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_second, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        webView = view.findViewById(R.id.web_view)

        webView.settings.javaScriptEnabled = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", AssetsPathHandler(requireContext()))
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                val channel: Array<WebMessagePort> = view!!.createWebMessageChannel()
                val outerPort = channel[0]
                val innerPort = channel[1]
                outerPort.setWebMessageCallback(object: WebMessageCallback() {
                    override fun onMessage(port: WebMessagePort?, message: WebMessage) {
                        val data = message.data.split(',').map { Integer.parseInt(it).toByte() }.toByteArray()
                        val codec = Codec.id.map()
                        val decoded = Bubblewrap.decode(data, codec)

                        Log.d("postoffice", "Decoded string: '${decoded}'")

                        val id = decoded["id"]!!
                        val request = decoded["request"]!!.asArrayValue().list()

                        lifecycleScope.launch {
                            val response = api.dispatch(request)
                            Log.d("postoffice", "Got response from api.dispatch: '$response'")
                            val encoded = Bubblewrap.encode(mapOf(Pair("response", response), Pair("id", id)), codec)
                            val raw = TextUtils.join(",", encoded.map { it.toString() })
                            outerPort.postMessage(WebMessage(raw))
                        }
                    }
                })
                view.postWebMessage(WebMessage("", arrayOf(innerPort)), Uri.parse("*"))
            }
        }

        val url = "https://appassets.androidplatform.net/assets/feature/container.html"
        webView.loadUrl(url)

        view.findViewById<Button>(R.id.button_second).setOnClickListener {
            findNavController().navigate(R.id.action_SecondFragment_to_FirstFragment)
        }
    }
}
