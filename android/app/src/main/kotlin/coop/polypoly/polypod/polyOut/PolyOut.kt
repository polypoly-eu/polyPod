package coop.polypoly.polypod.polyOut

import android.content.Context
import coop.polypoly.polypod.Preferences
import java.io.File
import java.nio.ByteBuffer
import java.util.zip.ZipFile

open class PolyOut(
    val context: Context
) {
    private val fsPrefix = "polypod://"
    open suspend fun readFile(path: String): ByteArray {
        if (path == "") {
            throw Error("Empty path in PolyOut.readFile")
        }
        val fs = Preferences.getFileSystem(context)
        val entryPathStart = path.indexOf('/', fsPrefix.length)
        val zipId = path.substring(0, entryPathStart)
        val entryPath = path.substring(entryPathStart + 1)
        val zip = ZipFile(File(fs[zipId]))
        return zip.getInputStream(zip.getEntry(entryPath)).readBytes()
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
        val zip = ZipFile(File(fs[path]))
        return zip.entries().toList().map {
            path + "/" + it.name
        }.toTypedArray()
    }
}
