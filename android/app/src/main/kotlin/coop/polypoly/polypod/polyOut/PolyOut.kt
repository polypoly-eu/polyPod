package coop.polypoly.polypod.polyOut

import android.content.Context
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.polyNav.ZipTools
import java.io.File
import java.nio.ByteBuffer

open class PolyOut(
    val context: Context
) {
    private val fsPrefix = "polypod://"

    open suspend fun readFile(path: String): ByteArray {
        if (path == "") {
            throw Error("Empty path in PolyOut.readFile")
        }
        val fs = Preferences.getFileSystem(context)

        val filePath = context.filesDir.absolutePath + "/" + path.replace(
            "://", ":/"
        )
        val encryptedFile = ZipTools.getEncryptedFile(context, filePath)
        encryptedFile.openFileInput().use {
            return it.readBytes()
        }

        return ByteArray(0)
    }

    open suspend fun writeFile(path: String, data: ByteBuffer): Boolean {
        return true
    }

    open suspend fun stat(path: String): MutableMap<String, String> {
        val fs = Preferences.getFileSystem(context)
        val result = mutableMapOf<String, String>()
        if (path == "") {
            return result
        }
        val file = File(context.filesDir.absolutePath.plus("/$path"))
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
        val retList = mutableListOf<String>()
        File(
            context.filesDir.absolutePath.plus("/$path")
        ).walkTopDown().forEach {
            retList.add(
                it.relativeTo(context.filesDir).path.replace(
                    ":/", "://"
                )
            )
        }
        return retList.toTypedArray()
    }
}
