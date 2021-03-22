package coop.polypoly.polypod.polyIn

import coop.polypoly.polypod.polyIn.rdf.*
import org.apache.jena.rdf.model.*
import java.io.File


open class PolyIn(private val databaseName: String = "database.nt") {
    val NS = "polypoly"

    private var model: Model = load()

    open suspend fun select(matcher: Matcher): List<Quad> {
        var retList: List<Quad> = listOf()

        // TODO: Kotlin-fy this
        val stmtsIterator = model.listStatements(
            if (matcher.subject == null) null else ResourceFactory.createResource(matcher.subject.iri),
            if (matcher.predicate == null) null else ResourceFactory.createProperty(matcher.predicate.iri),
            matcher.`object`?.iri,
        )
        while (stmtsIterator.hasNext()) {
            val stmt = stmtsIterator.next()
            retList = retList.plus(QuadBuilder.new()
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
            model = model.add(
                quadSubjectToResource(quad.subject),
                model.createProperty(quad.predicate.iri),
                quadObjectToResource(quad.`object`)
            )
        }
        save()
    }

    private fun load(): Model {
        model = ModelFactory.createDefaultModel()

        val database = File(databaseName)
        if (!database.exists()) {
            database.createNewFile()
        }
        database.inputStream().use { inputStream ->
            model = model.read(inputStream, null, "N-TRIPLE")
        }
        return model
    }

    private fun save() {
        File(databaseName).outputStream().use { out ->
            model = model.write(out, "N-TRIPLE")
        }
    }

    open fun clean() {
        model = model.removeAll()
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
