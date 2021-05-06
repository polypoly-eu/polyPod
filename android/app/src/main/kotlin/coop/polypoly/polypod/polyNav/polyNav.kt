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
    var cfg: PolyNavConfig? = null
) {
    private val registeredActions = HashSet<String>()
    lateinit var feature : Feature

    open fun setActiveActions(actions: Array<String>) {
        registeredActions.clear()
        registeredActions.addAll(actions)
        cfg?.onActionsChanged?.invoke(registeredActions.toList())
    }

    open fun setTitle(title: String) {
        cfg?.onTitleChanged?.invoke(title)
    }

    open fun setConfig(newCfg: PolyNavConfig) {
        cfg = newCfg
    }

    open fun openUrl(target: String) {
        val featureName = cfg?.feature?.name ?: return
        val url = cfg?.feature?.findUrl(target)
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

        webView.postWebMessage(WebMessage(action), Uri.parse("*"))

        return true
    }
}
