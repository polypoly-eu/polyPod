package eu.polypoly.pod.android

import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import eu.polypoly.pod.android.logging.LoggerFactory
import eu.polypoly.pod.android.polyIn.PolyIn
import eu.polypoly.pod.android.polyOut.PolyOut
import eu.polypoly.pod.android.postoffice.PostOfficeMessageCallback
import java.io.File
import java.util.zip.ZipFile

/**
 * A [Fragment] that is responsible for handling a single Feature
 */
open class FeatureFragment : Fragment() {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val args: FeatureFragmentArgs by navArgs()

    protected lateinit var api: PodApi
    private lateinit var webView: WebView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_feature, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        logger.debug("Inside FeatureFragment, feature to load: '{}'", args.featureName)
        api = setupPodApi()
        setupWebView(view)
        webView.loadUrl("https://appassets.androidplatform.net/assets/container/container.html?featureName=" + args.featureName)
    }

    private fun setupPodApi(): PodApi {
        return PodApi(PolyOut(), PolyIn())
    }

    private fun setupWebView(view: View) {
        webView = view.findViewById(R.id.web_view)
        webView.settings.javaScriptEnabled = true

        val mainDir = requireContext().getExternalFilesDir(null)
        val featuresDir = File(mainDir, "features")
        val featureFile = ZipFile(File(featuresDir, args.featureName + ".zip"))
        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/features/${args.featureName}/", FeaturesPathHandler(featureFile))
            .addPathHandler("/", PodPathHandler(requireContext()))
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

    private class PodPathHandler(context: Context) : WebViewAssetLoader.PathHandler {
        val assetsPathHandler: AssetsPathHandler = AssetsPathHandler(context)

        override fun handle(path: String): WebResourceResponse? {
            val finalPath = when (path) {
                "pod.js" -> "container/pod.js"
                else -> path.replaceFirst(Regex("^assets/"), "")
            }
            val response = assetsPathHandler.handle(finalPath)
            logger.debug("PodPathHandler, I'm supposed to handle path: '{}', finalPath: '{}', handling: '{}'", path, finalPath, response != null)
            return response
        }
    }

    private class FeaturesPathHandler(val featureFile: ZipFile) : WebViewAssetLoader.PathHandler {
        override fun handle(path: String): WebResourceResponse? {
            logger.debug("FeaturesPathHandler, I'm supposed to handle path: '{}'", path)
            val entry = featureFile.getEntry(path)
            if (entry == null) {
                logger.debug("FeaturesPathHandler, path '{}' not found, skipping", path)
                return null
            }
            val mimeType = guessMimeType(path)

            logger.debug("FeaturesPathHandler, handling path: '{}', entry: '{}', mimeType: '{}'", path, entry.name, mimeType)
            return WebResourceResponse(mimeType, null, featureFile.getInputStream(entry))
        }

        private fun guessMimeType(path: String): String {
            return when (path.substringAfterLast(".")) {
                "html" -> "text/html"
                "js" -> "application/javascript"
                "css" -> "text/css"
                "png" -> "image/png"
                "jpg" -> "image/jpeg"
                "svg" -> "image/svg+xml"
                "woff2" -> "font/woff2"
                else -> "text/plain"
            }
        }
    }
}
