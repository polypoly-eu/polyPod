package coop.polypoly.polypod

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.*
import android.widget.ImageView
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.postoffice.PostOfficeMessageCallback
import eu.polypoly.pod.android.polyOut.PolyOut
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
    private lateinit var navApi: PodNavApi

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_feature, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        (view.findViewById(R.id.feature_title) as TextView).text = args.featureName
        logger.debug("Inside FeatureFragment, feature to load: '{}'", args.featureName)
        val feature = FeatureStorage().loadFeature(requireContext(), args.featureFile)
        activity?.window?.navigationBarColor = feature.primaryColor
        api = setupPodApi()
        setupAppBar(view, feature.primaryColor)
        setupWebView(view, feature)
        setupNavigation(view, webView)
        webView.loadUrl("https://appassets.androidplatform.net/assets/container/container.html?featureName=" + args.featureName)
    }

    private fun setupPodApi(): PodApi {
        return PodApi(PolyOut(), PolyIn())
    }

    private fun setupAppBar(view: View, featureColor: Int) {
        view.findViewById<View>(R.id.app_bar).setBackgroundColor(featureColor)

        view.findViewById<View>(R.id.close_button).setOnClickListener {
            navigateBack()
        }

        view.findViewById<View>(R.id.info_button).setOnClickListener {
            navApi.triggerAction("info")
        }

        view.findViewById<View>(R.id.search_button).setOnClickListener {
            navApi.triggerAction("search")
        }
    }

    private fun navigateBack() {
        if (navApi.hasAction("back"))
            navApi.triggerAction("back")
        else
            findNavController().popBackStack()
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView(view: View, feature: Feature) {
        webView = view.findViewById(R.id.web_view)
        webView.setBackgroundColor(feature.primaryColor)
        webView.settings.javaScriptEnabled = true
        webView.settings.textZoom = 100

        // Enabling localStorage until window.pod.polyIn works
        webView.settings.domStorageEnabled = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/features/${feature.name}/", FeaturesPathHandler(feature.content))
            .addPathHandler("/", PodPathHandler(requireContext()))
            .build()

        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse? {
                if (request.url.lastPathSegment == "favicon.ico")
                    return WebResourceResponse(null, null, null)
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

    private fun setupNavigation(view: View, webView: WebView) {
        requireActivity().onBackPressedDispatcher.addCallback(viewLifecycleOwner, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() = navigateBack()
        })

        navApi = PodNavApi(webView, {
            activity?.runOnUiThread {
                updateAppBarActions(view)
            }
        }, {
            activity?.runOnUiThread {
                updateAppBarTitle(view, it)
            }
        })
    }

    private fun updateAppBarActions(view: View) {
        view.findViewById<ImageView>(R.id.close_button).setImageResource(if (navApi.hasAction("back")) R.drawable.ic_back_light else R.drawable.ic_close_light)
        view.findViewById<View>(R.id.info_button).visibility = if (navApi.hasAction("info")) View.VISIBLE else View.GONE
        view.findViewById<View>(R.id.search_button).visibility = if (navApi.hasAction("search")) View.VISIBLE else View.GONE
    }

    private fun updateAppBarTitle(view: View, title: String) {
        view.findViewById<TextView>(R.id.feature_title).text = title
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

    // The podNav API is currently experimental and not part of the formal
    // feature API yet - as soon as we know what it needs to look like,
    // that should change.
    private class PodNavApi(private val webView: WebView, onActionsChanged: () -> Unit, onTitleChanged: (String) -> Unit) {
        private val apiJsObject = "podNav"
        private val registeredActions = HashSet<String>()

        init {
            webView.addJavascriptInterface(object {
                @JavascriptInterface
                @Suppress("unused")
                fun setActiveActions(actions: Array<String>) {
                    registeredActions.clear()
                    registeredActions.addAll(actions)
                    onActionsChanged()
                }

                @JavascriptInterface
                @Suppress("unused")
                fun setTitle(title: String) {
                    onTitleChanged(title)
                }
            }, apiJsObject)
        }

        fun hasAction(action: String): Boolean {
            return registeredActions.contains(action)
        }

        fun triggerAction(action: String) {
            if (!hasAction(action))
                return
            // Absolutely horrible. Disgusting. I'm sorry.
            val featureWindow = "document.getElementsByTagName('iframe')[0].contentWindow"
            webView.evaluateJavascript("$featureWindow.$apiJsObject.actions['$action']()") {}
        }
    }
}
