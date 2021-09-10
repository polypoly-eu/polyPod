package coop.polypoly.polypod.polyNav

import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.OpenableColumns
import android.webkit.WebMessage
import android.webkit.WebView
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import coop.polypoly.polypod.Preferences
import java.io.File
import java.util.UUID
import kotlin.collections.HashSet

open class PolyNav(
    private val webView: WebView,
    private var observer: PolyNavObserver? = null,
    private val context: Context
) {
    private val registeredActions = HashSet<String>()
    private val fsPrefix = "polypod://"

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
        contentResolver?.openInputStream(importedUrl).use { inputStream ->
            if (inputStream == null) {
                throw Error("File copy error")
            }

            val mainKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .setUserAuthenticationRequired(false)
                .build()

            val encryptedZipPath = context.filesDir.absolutePath.plus(
                "/$fileName"
            )
            val encryptedZip = EncryptedFile.Builder(
                context,
                File(encryptedZipPath),
                mainKey,
                EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
            ).build()

            encryptedZip.openFileOutput().use {
                inputStream.copyTo(it)
            }
        }
        val fs = Preferences.getFileSystem(context).toMutableMap()
        val newId = fsPrefix + UUID.randomUUID().toString()
        fs[newId] = context.filesDir.path + "/" + fileName
        Preferences.setFileSystem(context, fs)
        return importedUrl
    }

    fun removeFile(id: String) {
        val fs = Preferences.getFileSystem(context).toMutableMap()
        context.deleteFile(File(fs[id]).name)
        fs.remove(id)
        Preferences.setFileSystem(context, fs)
    }
}
