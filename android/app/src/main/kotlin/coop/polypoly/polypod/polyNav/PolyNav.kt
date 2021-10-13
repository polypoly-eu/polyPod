package coop.polypoly.polypod.polyNav

import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.OpenableColumns
import android.webkit.WebMessage
import android.webkit.WebView
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.polyOut.PolyOut
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.async
import java.io.File
import java.util.UUID
import kotlin.collections.HashSet
import kotlin.coroutines.EmptyCoroutineContext

open class PolyNav(
    private val webView: WebView,
    private var observer: PolyNavObserver? = null,
    private val context: Context
) {
    private val registeredActions = HashSet<String>()
    private val coroutineScope = CoroutineScope(EmptyCoroutineContext)

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

    suspend fun importFile(): Uri? {
        val importedUrl = observer?.onPickFile?.invoke()
        if (importedUrl == null) {
            return importedUrl
        }

        val contentResolver = context.contentResolver
        val cursor: Cursor? = contentResolver.query(
            importedUrl, null, null, null, null, null
        )
        var fileName = ""
        cursor?.use {
            if (it.moveToFirst()) {
                fileName =
                    it.getString(
                        it.getColumnIndex(OpenableColumns.DISPLAY_NAME)
                    )
            }
        }
        coroutineScope.async {
            contentResolver?.openInputStream(importedUrl).use { inputStream ->
                if (inputStream == null) {
                    throw Error("File import error")
                }
                val newId = UUID.randomUUID().toString()
                val fs = Preferences.getFileSystem(context).toMutableMap()
                fs[PolyOut.fsPrefix + newId] = fileName
                Preferences.setFileSystem(context, fs)
                val featureName = Preferences.currentFeatureName
                    ?: throw Error("Cannot import for unknown feature")
                val targetPath = "$featureName/$newId"
                ZipTools.unzipAndEncrypt(inputStream, context, targetPath)
            }
        }.await()
        return importedUrl
    }

    fun removeFile(id: String) {
        val fs = Preferences.getFileSystem(context).toMutableMap()
        File(PolyOut.idToPath(id, context)).deleteRecursively()
        fs.remove(id)
        Preferences.setFileSystem(context, fs)
    }
}
