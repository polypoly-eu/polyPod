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

    private fun idToPath(id: String, context: Context): String {
        return context.filesDir.absolutePath + "/" + id.removePrefix(
            fsPrefix
        )
    }

    open suspend fun readFile(
        id: String
    ): ByteArray {
        if (id == "") {
            throw Error("Empty path in PolyOut.readFile")
        }

        ZipTools.getEncryptedFile(context, idToPath(id, context)).let {
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
        id: String
    ): MutableMap<String, String> {
        val fs = Preferences.getFileSystem(context)
        val result = mutableMapOf<String, String>()
        if (id == "") {
            return result
        }
        if (statCache.contains(id)) {
            return statCache.get(id)!!
        }
        val file = File(idToPath(id, context))
        result["name"] = fs.get(id) ?: file.name
        result["time"] = file.lastModified().toString()
        result["size"] = file.length().toString()
        result["id"] = id
        statCache[id] = result
        return result
    }
    open suspend fun readdir(
        id: String
    ): Array<String> {

        val fs = Preferences.getFileSystem(context)
        if (id == "") {
            return fs.keys.toTypedArray()
        }
        if (readdirCache.contains(id)) {
            return readdirCache.get(id)!!
        }
        val retList = mutableListOf<String>()
        File(idToPath(id, context)).walkTopDown().forEach {
            retList.add(
                fsPrefix + it.relativeTo(context.filesDir).path
            )
        }
        readdirCache[id] = retList.toTypedArray()
        return retList.toTypedArray()
    }
}
