package coop.polypoly.polypod.util

import java.io.File
import java.io.FileOutputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipOutputStream

class MockFeature {
    companion object {
        fun createMockFeaturePackage(
            parent: File,
            child: String,
            manifest: String
        ): File {
            val featurePackage = File(parent, child)
            ZipOutputStream(FileOutputStream(featurePackage)).use { zipOut ->
                zipOut.putNextEntry(ZipEntry("manifest.json"))
                zipOut.write(manifest.toByteArray())
                zipOut.closeEntry()
            }
            return featurePackage
        }
    }
}
