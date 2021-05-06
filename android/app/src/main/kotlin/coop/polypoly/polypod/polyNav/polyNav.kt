package coop.polypoly.polypod.polyNav

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.util.Base64
import android.webkit.WebMessage
import android.webkit.WebView
import android.widget.Toast
import coop.polypoly.polypod.R
import coop.polypoly.polypod.features.Feature
import eu.polypoly.bubblewrap.Bubblewrap
import eu.polypoly.bubblewrap.Codec
import org.msgpack.core.MessagePack
import org.msgpack.value.Value

open class PolyNav(
    private val webView: WebView,
    private val context: Context,
) {
    private val registeredActions = HashSet<String>()
    lateinit var  feature : Feature
    lateinit var onActionsChanged : ( (List<String>) -> Unit )
    lateinit var onTitleChanged: ( (String) -> Unit )

    open fun setActiveActions(actions: Array<String>) {
        registeredActions.clear()
        registeredActions.addAll(actions)
        onActionsChanged(registeredActions.toList())
    }

    open fun setTitle(title: String) {
        onTitleChanged(title)
    }

    open fun openUrl(target: String) {
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

    fun triggerAction(action: String): Boolean {
        if (!registeredActions.contains(action))
            return false

        val packer = MessagePack.newDefaultBufferPacker()
        packer.packInt(0)
        var codec = Codec.id.map()
        val encoded = Bubblewrap.encode<Map<String, Value>>(
            mapOf<String, Value>(
                Pair(
                    "request",
                    Codec.string.encode(action)
                ), Pair("id", MessagePack.newDefaultUnpacker(
                        packer.toMessageBuffer().array()).unpackValue()
                    )
            ), codec
        )
        val raw = Base64.encodeToString(encoded, Base64.NO_WRAP)

        webView.postWebMessage(WebMessage(raw), Uri.parse("*"))

//        // We are making too many assumptions about the code loaded into
//        // the WebView here, it would be nicer if the container would
//        // expose the actions some other way.
//        val featureWindow =
//            "document.getElementsByTagName('iframe')[0].contentWindow"
//        webView.evaluateJavascript("$featureWindow.$apiJsObject.actions['$action']()") {}
        return true
    }
}
