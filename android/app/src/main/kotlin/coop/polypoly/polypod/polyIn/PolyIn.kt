package coop.polypoly.polypod.polyIn

import coop.polypoly.polypod.polyIn.rdf.*
import org.apache.jena.rdf.model.*
import java.io.File

open class PolyIn(private val databaseName: String = "data.nt") {
    val NS = "polypoly"

    private val model: Model = load()

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
        save()
    }

    private fun load(): Model {
        val model = ModelFactory.createDefaultModel()

        val database = File(databaseName)
        if (!database.exists()) {
            database.createNewFile()
        }
        database.inputStream().use { inputStream ->
            model.read(inputStream, null, "N-TRIPLE")
        }
        return model
    }

    private fun save() {
        File(databaseName).outputStream().use { out ->
            model.write(out, "N-TRIPLE")
        }
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
