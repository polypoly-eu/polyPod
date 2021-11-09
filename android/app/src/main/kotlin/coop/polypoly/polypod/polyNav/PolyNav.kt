package coop.polypoly.polypod.polyNav

import android.content.Context
import android.net.Uri
import android.webkit.WebMessage
import android.webkit.WebView
import kotlin.collections.HashSet

open class PolyNav(
    private val webView: WebView,
    private var observer: PolyNavObserver? = null,
    private val context: Context
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

    suspend fun pickFile(type: String?) = observer?.onPickFile?.invoke(type)
}
