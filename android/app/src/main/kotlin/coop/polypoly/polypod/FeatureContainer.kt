package coop.polypoly.polypod

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.util.AttributeSet
import android.webkit.*
import android.widget.LinearLayout
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewAssetLoader
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.polyNav.PolyNav
import coop.polypoly.polypod.postoffice.PostOfficeMessageCallback
import eu.polypoly.pod.android.polyOut.PolyOut
import java.util.zip.ZipFile

@SuppressLint("SetJavaScriptEnabled")
class FeatureContainer(context: Context, attrs: AttributeSet? = null) :
    LinearLayout(context, attrs), LifecycleOwner {
    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    private val webView = WebView(context)
    private val registry = LifecycleRegistry(this)
    val api = PodApi(
        PolyOut(),
        PolyIn("data.nt", context.filesDir),
        PolyNav(
            webView = webView,
            context = context
        )
    )

    var feature: Feature? = null
        set(value) {
            if (value == null) return
            field = value
            loadFeature(value)
        }

    init {
        WebView.setWebContentsDebuggingEnabled(true)

        webView.layoutParams =
            LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        webView.settings.textZoom = 100
        webView.settings.javaScriptEnabled = true

        // Enabling localStorage to support polyExplorer data migration
        webView.settings.domStorageEnabled = true

        // Disable text selection
        webView.isLongClickable = false
        webView.setOnLongClickListener { true }
        webView.isHapticFeedbackEnabled = false

        addView(webView)
    }

    override fun getLifecycle(): Lifecycle = registry

    fun triggerNavAction(name: String): Boolean = api.polyNav.triggerAction(name)

    private fun loadFeature(feature: Feature) {
        webView.setBackgroundColor(feature.primaryColor)
        api.polyNav.feature = feature

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler(
                "/features/${feature.name}/",
                FeaturesPathHandler(context, feature.content)
            )
            .addPathHandler("/", PodPathHandler(context))
            .build()
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView,
                request: WebResourceRequest
            ): WebResourceResponse {
                if (request.url.lastPathSegment == "favicon.ico")
                    return WebResourceResponse(null, null, null)
                val response = assetLoader.shouldInterceptRequest(request.url)
                if (response == null) {
                    logger.warn("Feature ${feature.name} tried to load forbidden URL: ${request.url}")
                    val statusCode = 403
                    val reasonPhrase =
                        context.getString(R.string.dev_message_forbidden_resource_requested)
                    val message = "$statusCode - $reasonPhrase"
                    val errorResponse = WebResourceResponse(
                        "text/plain",
                        "UTF-8",
                        message.byteInputStream()
                    )
                    errorResponse.setStatusCodeAndReasonPhrase(
                        statusCode,
                        reasonPhrase
                    )
                    return errorResponse
                }
                return response
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                initPostOffice(view!!)
            }
        }

        webView.loadUrl("https://appassets.androidplatform.net/assets/container/container.html?featureName=${feature.name}")
    }

    private fun initPostOffice(view: WebView) {
        val channel: Array<WebMessagePort> = view.createWebMessageChannel()
        val outerPort = channel[0]
        val innerPort = channel[1]
        outerPort.setWebMessageCallback(
            PostOfficeMessageCallback(
                lifecycleScope,
                outerPort,
                api
            )
        )
        view.postWebMessage(WebMessage("", arrayOf(innerPort)), Uri.parse("*"))
    }

    private class PodPathHandler(context: Context) :
        WebViewAssetLoader.PathHandler {
        val assetsPathHandler: WebViewAssetLoader.AssetsPathHandler =
            WebViewAssetLoader.AssetsPathHandler(context)

        override fun handle(path: String): WebResourceResponse? {
            val finalPath = path.replaceFirst(Regex("^assets/"), "")
            val response = assetsPathHandler.handle(finalPath)
            logger.debug(
                "PodPathHandler, I'm supposed to handle path: '{}', finalPath: '{}', handling: '{}'",
                path,
                finalPath,
                response != null
            )
            return response
        }
    }

    private class FeaturesPathHandler(
        private val context: Context,
        private val featureFile: ZipFile
    ) : WebViewAssetLoader.PathHandler {
        override fun handle(path: String): WebResourceResponse? {
            logger.debug(
                "FeaturesPathHandler, I'm supposed to handle path: '{}'",
                path
            )
            val podApiFile = "pod.js"
            if (path == podApiFile) {
                val assetPath = "container/pod.js"
                logger.debug("$podApiFile requested - returning $assetPath")
                if (featureFile.getEntry(podApiFile) != null) {
                    logger.warn(
                        "Feature contains $podApiFile - ignoring in favour of $assetPath"
                    )
                }
                return WebViewAssetLoader.AssetsPathHandler(context)
                    .handle(assetPath)
            }

            val entry = featureFile.getEntry(path)
            if (entry == null) {
                logger.debug(
                    "FeaturesPathHandler, path '{}' not found, skipping",
                    path
                )
                return null
            }
            val mimeType = guessMimeType(path)

            logger.debug(
                "FeaturesPathHandler, handling path: '{}', entry: '{}', mimeType: '{}'",
                path,
                entry.name,
                mimeType
            )
            return WebResourceResponse(
                mimeType,
                null,
                featureFile.getInputStream(entry)
            )
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
