package coop.polypoly.polypod.polyNav

import android.content.Context
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import java.io.File
import java.io.InputStream
import java.util.zip.ZipInputStream

class ZipTools {
    companion object {
        open fun unzipAndEncrypt(
            inputZipStream: InputStream,
            context: Context,
            folder: String
        ) {
            ZipInputStream(inputZipStream).use { zis ->
                var entry = zis.nextEntry
                while (entry != null) {
                    val fileName = entry.name
                    val filePath = context.filesDir.absolutePath.plus(
                        "/$folder/$fileName"
                    )
                    if (entry.isDirectory) {
                        val dir = File(filePath)
                        dir.mkdirs()
                    } else {
                        getEncryptedFile(context, filePath).openFileOutput()
                            .use {
                                zis.copyTo(it)
                            }
                    }
                    entry = zis.nextEntry
                }
            }
        }

        open fun getEncryptedFile(
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
