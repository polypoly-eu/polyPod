package coop.polypoly.polypod.polyNav

import android.app.AlertDialog
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.webkit.WebMessage
import android.webkit.WebView
import android.widget.Toast
import coop.polypoly.polypod.R
import coop.polypoly.polypod.features.Feature

open class PolyNav(
    private val webView: WebView,
    private val context: Context,
    private var observer: PolyNavObserver? = null
) {
    private val registeredActions = HashSet<String>()

    open fun setActiveActions(actions: Array<String>) {
        registeredActions.clear()
        registeredActions.addAll(actions)
        observer?.onActionsChanged?.invoke(registeredActions.toList())
    }

    open fun setTitle(title: String) {
        observer?.onTitleChanged?.invoke(title)
    }

    open fun setNavObserver(newObserver: PolyNavObserver) {
        observer = newObserver
    }

    open fun openUrl(target: String) {
        observer?.onOpenUrl?.invoke(target)
    }

    fun triggerAction(action: String): Boolean {
        if (!registeredActions.contains(action))
            return false

        webView.postWebMessage(WebMessage(action), Uri.parse("*"))

        return true
    }
}
