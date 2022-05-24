package coop.polypoly.polypod.polyOut

import android.content.Context
import android.database.Cursor
import android.net.Uri
import android.provider.OpenableColumns
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.features.FeatureStorage
import coop.polypoly.polypod.polyNav.ZipTools
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.async
import kotlinx.coroutines.supervisorScope
import java.io.File
import java.nio.ByteBuffer
import java.util.UUID

open class PolyOut(
    val context: Context
) {
    private var readDirCache =
        mutableMapOf<String, Array<Map<String, String>>>()
    private var statCache = mutableMapOf<String, MutableMap<String, String>>()

    companion object {
        val fsDomain = "polypod-assets.local"
        val fsPrefix = "https://$fsDomain/"
        val fsFilesRoot = "FeatureFiles"

        fun filesPath(context: Context) =
            context.filesDir.absolutePath + "/featureFiles"

        fun pureId(id: String) = id
            // Previous polyPod builds used polypod:// URLs for files
            .removePrefix("polypod://")
            .removePrefix(fsPrefix)
            .removePrefix("$fsFilesRoot/")
            .removePrefix(FeatureStorage.activeFeatureId!! + "/")

        fun idToPath(id: String, context: Context): String {
            if (FeatureStorage.activeFeatureId == null) {
                throw Exception("Cannot execute without a feature")
            }
            val activeFeatureId = FeatureStorage.activeFeatureId
            val pureId = pureId(id)

            return filesPath(context) + "/" + activeFeatureId +
                "/" + pureId
        }
    }

    private fun pathToId(path: File, context: Context): String {
        return fsPrefix + path.relativeTo(
            File(filesPath(context) + "/" + FeatureStorage.activeFeatureId)
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
        val name = fs[id]?.reduce { acc, s ->
            if (acc.isEmpty()) {
                s
            } else {
                "$acc,$s"
            }
        }
        result["size"] = determineSize(file).toString()
        result["name"] = name ?: file.name
        result["time"] = (file.lastModified() / 1000).toString()
        result["id"] = id.removePrefix(fsPrefix).removePrefix(
            fsFilesRoot
        ).trimStart('/')
        statCache[id] = result
        return result
    }

    private fun determineSize(fileOrDirectory: File): Long {
        if (!fileOrDirectory.isDirectory) return fileOrDirectory.length()
        // We previously used FileUtils.sizeOfDirectory here, which had some
        // special cases for symbolic links and negative file sizes. It did,
        // however, use java.nio.file.Path.toPath(), which does not exist
        // on API 24, so we replaced it with this simpler implementation.
        val files = fileOrDirectory.listFiles() ?: return 0L
        return files.sumOf { determineSize(it) }
    }

    open suspend fun readDir(
        id: String
    ): Array<Map<String, String>> {
        System.out.println("hello")
        val fs = Preferences.getFileSystem(context)
        System.out.println("Why would you think it broke here")
        if (id == "") {
            val newFs = fs.filter {
                File(idToPath(it.key, context)).exists()
            }
            Preferences.setFileSystem(context, newFs)
            return newFs.keys.map {
                mutableMapOf<String, String>(
                    "id" to it,
                    "path" to it.removePrefix(fsPrefix)
                )
            }.toTypedArray()
        }
        if (readDirCache.contains(id)) {
            return readDirCache.get(id)!!
        }
        val retList = mutableListOf<Map<String, String>>()

        val dir = File(idToPath(id, context))
        dir.walkTopDown().forEach {
            val idPath =
                "$fsFilesRoot/" + pathToId(it, context).removePrefix(fsPrefix)
            val relPath = it.relativeTo(dir).path
            val idMap =
                mutableMapOf<String, String>("id" to idPath, "path" to relPath)
            retList.add(idMap)
        }
        readDirCache[id] = retList.toTypedArray()
        return retList.toTypedArray()
    }

    open suspend fun importArchive(
        url: String,
        destUrl: String? = null
    ): String? {
        val uri = Uri.parse(url)
        val contentResolver = context.contentResolver
        val cursor: Cursor? = contentResolver.query(
            uri, null, null, null, null, null
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

        val zipId = if (destUrl != null) {
            pureId(destUrl)
        } else {
            UUID.randomUUID().toString()
        }

        supervisorScope {
            this.async(Dispatchers.IO) {
                contentResolver?.openInputStream(uri).use { inputStream ->
                    if (inputStream == null) {
                        throw Error("File import error")
                    }
                    val fs = Preferences.getFileSystem(context).toMutableMap()
                    if (fs[zipId] != null) {
                        val array = fs[zipId]!!.toMutableList()
                        array.add(fileName)
                        fs[zipId] = array.toTypedArray()
                    } else {
                        fs[zipId] = arrayOf(fileName)
                    }
                    Preferences.setFileSystem(context, fs)
                    val featureId = FeatureStorage.activeFeatureId
                        ?: throw Error("Cannot import for unknown feature")
                    val targetPath = "$featureId/$zipId"
                    ZipTools.unzipAndEncrypt(inputStream, context, targetPath)
                }
            }
        }.await()
        return "polypod://$fsFilesRoot/$zipId"
    }

    open suspend fun removeArchive(id: String) {
        val fs = Preferences.getFileSystem(context).toMutableMap()
        File(idToPath(id, context)).deleteRecursively()
        fs.remove(id)
        Preferences.setFileSystem(context, fs)
    }
}
