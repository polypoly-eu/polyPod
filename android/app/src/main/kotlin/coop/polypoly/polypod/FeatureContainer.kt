package coop.polypoly.polypod

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.util.AttributeSet
import android.webkit.*
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewAssetLoader
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.postoffice.PostOfficeMessageCallback
import eu.polypoly.pod.android.polyOut.PolyOut
import java.util.zip.ZipFile

class FeatureContainer(context: Context, attrs: AttributeSet? = null) : WebView(context, attrs), LifecycleOwner {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val registry: LifecycleRegistry = LifecycleRegistry(this)
    private val api: PodApi = PodApi(PolyOut(), PolyIn())
    private lateinit var navApi: PodNavApi

    var feature: Feature? = null
        set(value) {
            if (value == null) return
            field = value
            loadFeature(value)
        }

    var navActionsChangedHandler: (List<String>) -> Unit = {}
    var navTitleChangedHandler: (String) -> Unit = {}

    override fun getLifecycle(): Lifecycle {
        return registry
    }

    fun triggerNavAction(name: String): Boolean = navApi.triggerAction(name)

    private fun loadFeature(feature: Feature) {
        setupWebView(feature)
        navApi = PodNavApi(this, { navActionsChangedHandler(it) }, { navTitleChangedHandler(it) })
        loadUrl("https://appassets.androidplatform.net/assets/container/container.html?featureName=" + feature.name)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView(feature: Feature) {
        setBackgroundColor(feature.primaryColor)
        settings.javaScriptEnabled = true
        settings.textZoom = 100

        // Enabling localStorage until window.pod.polyIn works
        settings.domStorageEnabled = true

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/features/${feature.name}/", FeaturesPathHandler(feature.content))
            .addPathHandler("/", PodPathHandler(context))
            .build()

        webViewClient = object : WebViewClient() {
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

    private class PodPathHandler(context: Context) : WebViewAssetLoader.PathHandler {
        val assetsPathHandler: WebViewAssetLoader.AssetsPathHandler =
            WebViewAssetLoader.AssetsPathHandler(context)

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
    private class PodNavApi(private val webView: WebView, onActionsChanged: (List<String>) -> Unit, onTitleChanged: (String) -> Unit) {
        private val apiJsObject = "podNav"
        private val registeredActions = HashSet<String>()

        init {
            webView.addJavascriptInterface(object {
                @JavascriptInterface
                @Suppress("unused")
                fun setActiveActions(actions: Array<String>) {
                    registeredActions.clear()
                    registeredActions.addAll(actions)
                    onActionsChanged(registeredActions.toList())
                }

                @JavascriptInterface
                @Suppress("unused")
                fun setTitle(title: String) {
                    onTitleChanged(title)
                }
            }, apiJsObject)
        }

        fun triggerAction(action: String): Boolean {
            if (!registeredActions.contains(action))
                return false
            // We are making too many assumptions about the code loaded into
            // the WebView here, it would be nicer if the container would
            // expose the actions some other way.
            val featureWindow = "document.getElementsByTagName('iframe')[0].contentWindow"
            webView.evaluateJavascript("$featureWindow.$apiJsObject.actions['$action']()") {}
            return true
        }
    }
}
