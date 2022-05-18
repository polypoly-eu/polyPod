package coop.polypoly.polypod.polyNav

import android.content.Context
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import coop.polypoly.polypod.polyOut.PolyOut
import java.io.File
import java.io.InputStream
import java.util.zip.ZipInputStream

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
    }
}
