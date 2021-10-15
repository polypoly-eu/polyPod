package coop.polypoly.polypod

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.AttributeSet
import android.webkit.*
import android.widget.LinearLayout
import android.widget.Toast
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleOwner
import androidx.lifecycle.LifecycleRegistry
import androidx.lifecycle.lifecycleScope
import androidx.webkit.WebViewAssetLoader
import coop.polypoly.polypod.features.Feature
import coop.polypoly.polypod.info.Info
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.network.Network
import coop.polypoly.polypod.polyIn.PolyIn
import coop.polypoly.polypod.polyNav.PolyNav
import coop.polypoly.polypod.polyNav.PolyNavObserver
import coop.polypoly.polypod.polyOut.PolyOut
import coop.polypoly.polypod.postoffice.PostOfficeMessageCallback
import java.io.ByteArrayInputStream
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
        PolyOut(context),
        PolyIn(context, context.filesDir),
        PolyNav(
            webView = webView, context = context
        ),
        Info(),
        Network(context)
    )

    var feature: Feature? = null
        set(value) {
            if (value == null) return
            field = value
            loadFeature(value)
        }

    var errorHandler: ((String) -> Unit)? = null

    init {
        webView.layoutParams =
            LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT)
        webView.settings.textZoom = 100
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(
            PodInternalInterface(context) { error: String ->
                errorHandler?.invoke(error)
            },
            "podInternal"
        )

        // Enabling localStorage to support polyExplorer data migration
        webView.settings.domStorageEnabled = true

        // Disable text selection
        webView.isLongClickable = false
        webView.setOnLongClickListener { true }
        webView.isHapticFeedbackEnabled = false

        WebView.setWebContentsDebuggingEnabled(true)
        addView(webView)
    }

    override fun getLifecycle(): Lifecycle = registry

    fun triggerNavAction(name: String): Boolean =
        api.polyNav.triggerAction(name)

    fun openUrl(target: String) {
        val featureName = feature?.name ?: return
        val url = feature?.findUrl(target)
        if (url == null) {
            val message = context.getString(
                R.string.message_url_open_prevented, featureName, target
            )
            Toast.makeText(webView.context, message, Toast.LENGTH_LONG).show()
            return
        }

        val message = context.getString(
            R.string.message_url_open_requested, featureName, url
        )
        val confirmLabel = context.getString(R.string.button_url_open_confirm)
        val rejectLabel = context.getString(R.string.button_url_open_reject)
        AlertDialog.Builder(context)
            .setMessage(message)
            .setPositiveButton(confirmLabel) { _, _ ->
                context.startActivity(
                    Intent(Intent.ACTION_VIEW, Uri.parse(url))
                )
            }
            .setNegativeButton(rejectLabel) { _, _ -> }
            .show()
    }

    private fun loadFeature(feature: Feature) {
        webView.setBackgroundColor(feature.primaryColor)
        Preferences.currentFeatureName = feature.id
        api.polyNav.setNavObserver(
            PolyNavObserver(
                null,
                null,
                { url -> openUrl(url) },
                null
            )
        )

        val assetLoader = WebViewAssetLoader.Builder()
            .setDomain(PolyOut.fsDomain)
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
                if (request.url.lastPathSegment == "favicon.ico") {
                    return WebResourceResponse(
                        null,
                        null,
                        null
                    )
                }
                var rawPath = request.url.path?.removePrefix(PolyOut.fsPrefix)!!

                val firstSlash = rawPath.indexOf('/', 1) + 1
                val endIndex = rawPath.indexOf('/', firstSlash)
                if (endIndex > 0) {
                    rawPath = rawPath.removeRange(0, endIndex + 1)
                }
                if (rawPath.startsWith(PolyOut.fsFilesRoot)) {
                    return WebResourceResponse(
                        null, null,
                        ByteArrayInputStream(
                            api.polyOut.readFile(rawPath)
                        )
                    )
                }
                val response = assetLoader.shouldInterceptRequest(request.url)
                if (response == null) {
                    logger.warn(
                        """
                            Feature ${feature.name} tried to load forbidden URL:
                            ${request.url}
                        """
                    )
                    val statusCode = 403
                    val reasonPhrase =
                        context.getString(
                            R.string.dev_message_forbidden_resource_requested
                        )
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

        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(
                consoleMessage: ConsoleMessage?
            ): Boolean {
                if (consoleMessage == null) {
                    logger.warn("Unknown message from " +
                        Preferences.currentFeatureName)
                    return true
                }
                val message = "Message from " +
                    Preferences.currentFeatureName + ": " +
                    consoleMessage.messageLevel() + ": " +
                    consoleMessage.message()
                when (consoleMessage?.messageLevel()) {
                    ConsoleMessage.MessageLevel.ERROR,
                    ConsoleMessage.MessageLevel.WARNING ->
                        logger.warn(message)
                    else -> logger.info(message)
                }
                return true
            }
        }

        /* ktlint-disable max-line-length */
        webView.loadUrl("${PolyOut.fsPrefix}assets/container/container.html?featureName=${feature.name}")
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
        view.postWebMessage(
            WebMessage("", arrayOf(innerPort)), Uri.parse("*")
        )
    }

    private class PodPathHandler(context: Context) :
        WebViewAssetLoader.PathHandler {
        val assetsPathHandler: WebViewAssetLoader.AssetsPathHandler =
            WebViewAssetLoader.AssetsPathHandler(context)

        override fun handle(path: String): WebResourceResponse? {
            val finalPath = path.replaceFirst(
                Regex("^assets/"),
                ""
            )
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

    class PodInternalInterface(
        val context: Context,
        val errorHandler: (String) -> Unit
    ) {
        @Suppress("unused")
        @JavascriptInterface
        fun reportError(error: String) {
            logger.warn("Uncaught error from " +
                Preferences.currentFeatureName + ": " + error)
            errorHandler(error)
        }

        @Suppress("unused")
        @JavascriptInterface
        fun copyToClipboard(text: String?) {
            var clipboard: ClipboardManager =
                context.getSystemService(ClipboardManager::class.java)
            val clip = ClipData.newPlainText("nativeClipboardText", text)
            clipboard.setPrimaryClip(clip)
        }
    }
}
