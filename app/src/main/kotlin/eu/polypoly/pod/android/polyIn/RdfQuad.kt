package eu.polypoly.pod.android.polyIn

class RdfQuad(
    val subject: IRI,    // or BlankNode
    val predicate: IRI,
    val `object`: IRI,    // or Literal or BlankNode
    val graph: IRI  // or BlankNode or constant DefaultGraph
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as RdfQuad

        if (subject != other.subject) return false
        if (predicate != other.predicate) return false
        if (`object` != other.`object`) return false
        if (graph != other.graph) return false

        return true
    }

    override fun hashCode(): Int {
        var result = subject.hashCode()
        result = 31 * result + predicate.hashCode()
        result = 31 * result + `object`.hashCode()
        result = 31 * result + graph.hashCode()
        return result
    }

    override fun toString(): String {
        return "RdfQuad(subject=$subject, predicate=$predicate, `object`=$`object`, graph=$graph)"
    }
}
