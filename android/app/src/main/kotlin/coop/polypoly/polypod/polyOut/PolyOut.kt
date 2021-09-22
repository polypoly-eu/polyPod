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
    private var readdirCache = mutableMapOf<String, Array<String>>()
    private var statCache = mutableMapOf<String, MutableMap<String, String>>()

    open suspend fun readFile(
        path: String
    ): ByteArray {
        if (path == "") {
            throw Error("Empty path in PolyOut.readFile")
        }
        val filePath = context.filesDir.absolutePath + "/" + path.removePrefix(
            fsPrefix
        )
        ZipTools.getEncryptedFile(context, filePath).let {
            it.openFileInput().use {
                return it.readBytes()
            }
        }

        return ByteArray(0)
    }

    open suspend fun writeFile(path: String, data: ByteBuffer): Boolean {
        return true
    }

    open suspend fun stat(
        path: String
    ): MutableMap<String, String> {
        val fs = Preferences.getFileSystem(context)
        val result = mutableMapOf<String, String>()
        if (path == "") {
            return result
        }
        if (statCache.contains(path)) {
            return statCache.get(path)!!
        }
        val filePath = path.removePrefix(fsPrefix)
        val file = File(context.filesDir.absolutePath.plus("/$filePath"))
        result["name"] = fs.get(path) ?: file.name
        result["time"] = file.lastModified().toString()
        result["size"] = file.length().toString()
        result["id"] = path
        statCache[path] = result
        return result
    }
    open suspend fun readdir(
        path: String
    ): Array<String> {

        val fs = Preferences.getFileSystem(context)
        if (path == "") {
            return fs.keys.toTypedArray()
        }
        if (readdirCache.contains(path)) {
            return readdirCache.get(path)!!
        }
        val retList = mutableListOf<String>()
        val filePath = path.removePrefix(fsPrefix)
        File(
            context.filesDir.absolutePath.plus("/$filePath")
        ).walkTopDown().forEach {
            retList.add(
                fsPrefix + it.relativeTo(context.filesDir).path
            )
        }
        readdirCache[path] = retList.toTypedArray()
        return retList.toTypedArray()
    }
}
