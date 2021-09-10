package coop.polypoly.polypod.polyOut

import android.content.Context
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import coop.polypoly.polypod.Preferences
import java.io.File
import java.nio.ByteBuffer
import java.util.zip.ZipInputStream

open class PolyOut(
    val context: Context
) {
    private val fsPrefix = "polypod://"
    private val mainKey = MasterKey.Builder(context)
        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
        .setUserAuthenticationRequired(false)
        .build()

    open suspend fun readFile(path: String): ByteArray {
        val fs = Preferences.getFileSystem(context)
        if (path == "") {
            throw Error("Not found")
        }
        val entryPathStart = path.indexOf('/', fsPrefix.length)
        val zipId = path.substring(0, entryPathStart)
        val entryPath = path.substring(entryPathStart + 1)

        val encryptedZip = EncryptedFile.Builder(
            context,
            File(fs[zipId]),
            mainKey,
            EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
        ).build()
        ZipInputStream(encryptedZip.openFileInput()).use {
            do {
                val zipEntry = it.nextEntry
                if (zipEntry?.name == entryPath) {
                    return it.readBytes()
                }
            } while (zipEntry != null)
        }

        throw Error("Not found")
    }

    open suspend fun writeFile(path: String, data: ByteBuffer): Boolean {
        return true
    }

    open suspend fun stat(path: String): MutableMap<String, String> {
        val fs = Preferences.getFileSystem(context)
        var result = mutableMapOf<String, String>()
        if (path == "") {
            return result
        }
        val file = File(fs[path])
        result["name"] = file.name
        result["time"] = file.lastModified().toString()
        result["size"] = file.length().toString()
        result["id"] = path
        return result
    }

    open suspend fun readdir(path: String): Array<String> {
        val fs = Preferences.getFileSystem(context)
        if (path == "") {
            return fs.keys.toTypedArray()
        }
        val encryptedZip = EncryptedFile.Builder(
            context,
            File(fs[path]),
            mainKey,
            EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
        ).build()
        var zipEntryNames = mutableListOf<String>()
        ZipInputStream(encryptedZip.openFileInput()).use {
            do {
                zipEntryNames.add(it.nextEntry.name)
            } while (it.available() != 0)
        }

        return zipEntryNames.toList().map {
            path + "/" + it
        }.toTypedArray()
    }
}
