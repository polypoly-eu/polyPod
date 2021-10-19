package coop.polypoly.polypod.polyOut

import android.content.Context
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.polyNav.ZipTools
import org.apache.commons.io.FileUtils
import java.io.File
import java.nio.ByteBuffer

open class PolyOut(
    val context: Context
) {
    private var readdirCache = mutableMapOf<String, Array<String>>()
    private var statCache = mutableMapOf<String, MutableMap<String, String>>()

    companion object {
        val fsDomain = "polypod-assets.local"
        val fsPrefix = "https://$fsDomain/"
        val fsFilesRoot = "FeatureFiles"

        fun filesPath(context: Context) =
            context.filesDir.absolutePath + "/featureFiles"

        fun idToPath(id: String, context: Context): String {
            if (Preferences.currentFeatureName == null) {
                throw Exception("Cannot execute without a feature")
            }
            val currentFeatureName = Preferences.currentFeatureName!!
            val pureId = id
                // Previous polyPod builds used polypod:// URLs for files
                .removePrefix("polypod://")
                .removePrefix(fsPrefix)
                .removePrefix("$fsFilesRoot/")
                .removePrefix("$currentFeatureName/")

            return filesPath(context) + "/" + Preferences.currentFeatureName +
                "/" + pureId
        }
    }

    private fun pathToId(path: File, context: Context): String {
        return fsPrefix + path.relativeTo(
            File(filesPath(context) + "/" + Preferences.currentFeatureName)
        ).path
    }

    open fun readFile(
        id: String
    ): ByteArray {
        if (id == "") {
            throw Exception("Empty path in PolyOut.readFile")
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
        if (!file.exists())
            throw Exception("stat: No such file '$id'")

        if (file.isDirectory()) {
            result["size"] = FileUtils.sizeOfDirectory(file).toString()
        } else {
            result["size"] = file.length().toString()
        }
        result["name"] = fs.get(id) ?: file.name
        result["time"] = (file.lastModified() / 1000).toString()
        result["id"] = id.removePrefix(fsPrefix).removePrefix(
            fsFilesRoot
        ).trimStart('/')
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
                "$fsFilesRoot/" + pathToId(it, context).removePrefix(fsPrefix)
            )
        }
        readdirCache[id] = retList.toTypedArray()
        return retList.toTypedArray()
    }
}
