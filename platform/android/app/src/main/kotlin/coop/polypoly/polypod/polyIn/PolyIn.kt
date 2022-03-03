package coop.polypoly.polypod.polyIn

import android.content.Context
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import coop.polypoly.polypod.logging.LoggerFactory
import coop.polypoly.polypod.polyIn.rdf.BlankNodeObject
import coop.polypoly.polypod.polyIn.rdf.BlankNodeSubject
import coop.polypoly.polypod.polyIn.rdf.IRI
import coop.polypoly.polypod.polyIn.rdf.IRIObject
import coop.polypoly.polypod.polyIn.rdf.IRISubject
import coop.polypoly.polypod.polyIn.rdf.LiteralObject
import coop.polypoly.polypod.polyIn.rdf.Matcher
import coop.polypoly.polypod.polyIn.rdf.Quad
import coop.polypoly.polypod.polyIn.rdf.QuadBuilder
import coop.polypoly.polypod.polyIn.rdf.QuadObject
import coop.polypoly.polypod.polyIn.rdf.QuadSubject
import org.apache.jena.rdf.model.Model
import org.apache.jena.rdf.model.ModelFactory
import org.apache.jena.rdf.model.RDFNode
import org.apache.jena.rdf.model.Resource
import org.apache.jena.rdf.model.ResourceFactory
import java.io.File
import java.io.FileOutputStream
import java.lang.Exception

const val RDF_FORMAT = "N-TRIPLE"
const val NS = "polypoly"

open class PolyIn(
    private val context: Context,
    private val databaseFolder: File? = null,
    private val databaseName: String = "data_enc.nt",
) {
    private val databaseNameOld = "data.nt"

    private val model: Model = load()
    private var encryptedFileOut: FileOutputStream? = null
    private var encryptedDatabase: EncryptedFile? = null

    companion object {
        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)
    }

    open suspend fun select(matcher: Matcher): List<Quad> {
        val retList: MutableList<Quad> = mutableListOf()

        val stmtsIterator = model.listStatements(
            matcher.subject?.let {
                ResourceFactory.createResource(matcher.subject.iri)
            },
            matcher.predicate?.let {
                ResourceFactory.createProperty(matcher.predicate.iri)
            },
            matcher.`object`?.iri,
        )
        for (stmt in stmtsIterator) {
            retList.add(
                QuadBuilder.new()
                    .withDefaultGraph()
                    .withSubject(IRI(stmt.subject.uri))
                    .withPredicate(IRI(stmt.predicate.uri))
                    .withObject(
                        IRI(stmt.`object`.toString())
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

    open suspend fun delete(quads: List<Quad>) {
        quads.forEach { quad ->
            model.remove(
                quadSubjectToResource(quad.subject),
                model.createProperty(quad.predicate.iri),
                quadObjectToResource(quad.`object`)
            )
        }
    }

    open suspend fun has(quads: List<Quad>): Boolean {
        return quads.any { quad ->
            model.contains(
                quadSubjectToResource(quad.subject),
                model.createProperty(quad.predicate.iri),
                quadObjectToResource(quad.`object`)
            )
        }
    }

    private fun getDatabase(file: File): EncryptedFile {
        val mainKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            // We only strongly recommend users to set up a lock screen, but do
            // not require it
            .setUserAuthenticationRequired(false)
            .build()

        return EncryptedFile.Builder(
            context,
            file,
            mainKey,
            EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
        ).build()
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
        if (unencryptedDatabase.exists()) {
            unencryptedDatabase.inputStream().use { inputStream ->
                model.read(inputStream, null, RDF_FORMAT)
            }
            unencryptedDatabase.delete()
            return model
        }

        if (encryptedDatabase == null) {
            encryptedDatabase = getDatabase(database)
        }

        encryptedDatabase!!.openFileInput().use { inputStream ->
            model.read(inputStream, null, RDF_FORMAT)
        }
        return model
    }

    private fun save() {
        if (encryptedFileOut != null) {
            model.write(encryptedFileOut, RDF_FORMAT)
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
            encryptedDatabase = getDatabase(database)

            encryptedFileOut = encryptedDatabase!!.openFileOutput()
            model.write(encryptedFileOut, RDF_FORMAT)
            encryptedFileOut?.flush()
            encryptedFileOut?.close()
        } catch (e: Exception) {
            logger.error(e.message)
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
                NS,
                quadSubject.subject.value
            )
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
