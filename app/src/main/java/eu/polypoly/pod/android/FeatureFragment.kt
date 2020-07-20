package eu.polypoly.pod.android

import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import eu.polypoly.pod.android.postoffice.PostOfficeMessageCallback

/**
 * A [Fragment] that is responsible for handling a single Feature
 */
open class FeatureFragment : Fragment() {

    private val args: FeatureFragmentArgs by navArgs()

    // TODO - create API object per Feature
    private val api: PodApi = PodApi
    private lateinit var webView: WebView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_feature, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Log.d("FeatureFragment", "Inside FeatureFragment, feature to load: '${args.featureName}'")
        setupWebView(view)
        webView.loadUrl("https://appassets.androidplatform.net/assets/feature/container.html?featureName=" + args.featureName)
    }

    private fun setupWebView(view: View) {
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
                initPostOffice(view!!)
            }
        }
    }

    private fun initPostOffice(view: WebView) {
        val channel: Array<WebMessagePort> = view.createWebMessageChannel()
        val outerPort = channel[0]
        val innerPort = channel[1]
        outerPort.setWebMessageCallback(PostOfficeMessageCallback(lifecycleScope, outerPort, api))
        view.postWebMessage(WebMessage("", arrayOf(innerPort)), Uri.parse("*"))
    }
}
