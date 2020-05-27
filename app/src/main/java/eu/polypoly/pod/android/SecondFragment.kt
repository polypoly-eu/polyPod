package eu.polypoly.pod.android

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import android.webkit.WebMessagePort.WebMessageCallback
import android.widget.Button
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler


/**
 * A simple [Fragment] subclass as the second destination in the navigation.
 */
class SecondFragment : Fragment() {

    private val args: SecondFragmentArgs by navArgs()
    private var port: WebMessagePort? = null;
    private var webView: WebView? = null;

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
        webView!!.settings.javaScriptEnabled = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", AssetsPathHandler(context!!))
            .build()

        webView!!.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                return assetLoader.shouldInterceptRequest(request.url)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                Log.d("postoffice", "initializing postoffice");
                val channel: Array<WebMessagePort> = view!!.createWebMessageChannel()
                val outerPort = channel[0]
                val innerPort = channel[1]
                outerPort.setWebMessageCallback(object: WebMessageCallback() {
                    override fun onMessage(port: WebMessagePort?, message: WebMessage) {
                        Log.d("postoffice", "Received message: '${message.data}'");
                    }
                })
                view.postWebMessage(WebMessage("", arrayOf(innerPort)), Uri.parse("*"))
            }
        }

        val url = "https://appassets.androidplatform.net/assets/feature/container.html"
        webView!!.loadUrl(url)

        view.findViewById<Button>(R.id.button_second).setOnClickListener {
            findNavController().navigate(R.id.action_SecondFragment_to_FirstFragment)
        }
    }

}
