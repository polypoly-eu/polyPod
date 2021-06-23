package coop.polypoly.polypod.polyIn

import android.content.Context
import coop.polypoly.polypod.polyIn.rdf.*
import org.apache.jena.rdf.model.*
import java.io.File
import androidx.security.crypto.*
import java.io.FileOutputStream
import java.lang.Exception

open class PolyIn(
    private val databaseName: String = "data_enc.nt",
    private val databaseFolder: File? = null,
    private val context: Context,
) {
    val NS = "polypoly"
    val LANG = "N-TRIPLE"
    private val databaseNameOld = "data.nt"

    private val model: Model = load()
    private var encryptedFileOut: FileOutputStream? = null
    private var encryptedDatabase: EncryptedFile? = null

    open suspend fun select(matcher: Matcher): List<Quad> {
        val retList: MutableList<Quad> = mutableListOf()

        val stmtsIterator = model.listStatements(
            matcher.subject?.let { ResourceFactory.createResource(matcher.subject.iri) },
            matcher.predicate?.let {ResourceFactory.createProperty(matcher.predicate.iri) },
            matcher.`object`?.iri,
        )
        for (stmt in stmtsIterator) {
            retList.add(QuadBuilder.new()
                .withDefaultGraph()
                .withSubject(IRI(stmt.subject.uri))
                .withPredicate(IRI(stmt.predicate.uri))
                .withObject(IRI(stmt.`object`.toString())
                ).build()
            )
        }
        return retList
    }

    open suspend fun add(quads: List<Quad>) {
        quads.forEach { quad ->
            model.add(
                quadSubjectToResource(quad.subject),
                model.createProperty(quad.predicate.iri),
                quadObjectToResource(quad.`object`)
            )
        }
        // TODO: Implement "isDirty" flag or expose save() to features
        save()
    }

    private fun load(): Model {
        val model = ModelFactory.createDefaultModel()

        val database = File(databaseFolder, databaseName)
        if (!database.exists()) {
            return model
        }

        // Migrate old unencrypted database
        // TODO: Remove this when migration is not needed anymore
        val unencryptedDatabase = File(databaseFolder, databaseNameOld)
        if (!unencryptedDatabase.exists()) {
            unencryptedDatabase.inputStream().use { inputStream ->
                model.read(inputStream, null, LANG)
            }
            unencryptedDatabase.delete()
            return model
        }

        if (encryptedDatabase == null) {
            val mainKey = MasterKey.Builder(context!!)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .setUserAuthenticationRequired(true)
                .build()

            encryptedDatabase = EncryptedFile.Builder(
                context,
                database,
                mainKey,
                EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
            ).build()
        }

        encryptedDatabase!!.openFileInput().use { inputStream ->
            model.read(inputStream, null, LANG)
        }
        return model
    }

    private fun save() {
        if (encryptedFileOut != null) {
            model.write(encryptedFileOut, "N-TRIPLE")
            return
        }

        // We cannot append to encrypted files, so we make a copy of an old file
        // and create a new encrypted one for writing
        val tempFileName = "temp_" + databaseName
        val database = File(databaseFolder, databaseName)
        val tempDatabase = File(databaseFolder, tempFileName)
        if (!database.exists()) {
            database.createNewFile()
        }
        database.renameTo(tempDatabase)
        try {

            val mainKey = MasterKey.Builder(context!!)
                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                .setUserAuthenticationRequired(true)
                .build()

            encryptedDatabase = EncryptedFile.Builder(
                context,
                database,
                mainKey,
                EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
            ).build()

            encryptedFileOut = encryptedDatabase!!.openFileOutput()
            model.write(encryptedFileOut, "N-TRIPLE")
            encryptedFileOut?.flush()
            encryptedFileOut?.close()
        } catch (e: Exception) {
            tempDatabase.renameTo(database)
        }
        File(databaseFolder, tempFileName).delete()
    }

    open fun clean() {
        model.removeAll()
        save()
    }

    private fun quadSubjectToResource(quadSubject: QuadSubject): Resource {
        return when (quadSubject) {
            is BlankNodeSubject -> model.createProperty(
                NS, quadSubject.subject.value)
            is IRISubject -> model.createResource(quadSubject.subject.iri)
        }
    }

    private fun quadObjectToResource(quadObject: QuadObject): RDFNode {
        return when (quadObject) {
            is BlankNodeObject -> model.createProperty(
                NS, quadObject.`object`.value
            )
            is LiteralObject -> model.createTypedLiteral(
                quadObject.`object`.value
            )
            is IRIObject -> model.createResource(quadObject.`object`.iri)
        }
    }
}
