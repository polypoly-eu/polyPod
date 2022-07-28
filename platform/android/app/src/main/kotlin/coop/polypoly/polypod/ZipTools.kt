package coop.polypoly.polypod.polyNav

import android.content.Context
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import coop.polypoly.polypod.polyOut.PolyOut
import java.io.BufferedOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import java.nio.file.Path
import java.util.zip.ZipFile
import java.util.zip.ZipInputStream
import kotlin.io.path.absolutePathString
import kotlin.io.path.createDirectories
import kotlin.io.path.exists

class ZipTools {
    companion object {
        fun unzipAndEncrypt(
            inputZipStream: InputStream,
            context: Context,
            folder: String
        ) {
            ZipInputStream(inputZipStream).use { zis ->
                var entry = zis.nextEntry
                while (entry != null) {
                    val fileName = entry.name
                    val filePath = PolyOut.filesPath(context).plus(
                        "/$folder/$fileName"
                    )

                    val file = File(filePath)

                    if (entry.isDirectory) {
                        file.mkdirs()
                    } else {
                        // create parent directories for files
                        file.parentFile?.mkdirs()
                    }

                    if (!entry.isDirectory) {
                        getEncryptedFile(context, filePath).openFileOutput()
                            .use {
                                zis.copyTo(it)
                            }
                    }

                    entry = zis.nextEntry
                }
            }
        }

        fun getEncryptedFile(
            context: Context,
            path: String
        ): EncryptedFile {
            val mainKey = MasterKey.Builder(context)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .setUserAuthenticationRequired(false)
                .build()

            return EncryptedFile.Builder(
                context,
                File(path),
                mainKey,
                EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
            ).build()
        }

        fun unzip(file: File, destDirectory: Path) {
            if (!destDirectory.exists()) destDirectory.createDirectories()
            ZipFile(file).use { zip ->
                zip.entries().asSequence().forEach { entry ->
                    zip.getInputStream(entry).use { input ->
                        val destPath = destDirectory.resolve(entry.name)
                        if (entry.isDirectory) destPath.createDirectories()
                        else extractFile(input, destPath)
                    }
                }
            }
        }

        private fun extractFile(inputStream: InputStream, destFilePath: Path) {
            BufferedOutputStream(
                FileOutputStream(
                    destFilePath.absolutePathString()
                )
            ).use { bos ->
                var read: Int
                val bytesIn = ByteArray(4096)
                while (inputStream.read(bytesIn).also { read = it } != -1) {
                    bos.write(bytesIn, 0, read)
                }
            }
        }
    }
}
