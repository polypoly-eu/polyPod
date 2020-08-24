package eu.polypoly.pod.android.polyIn

class IRI(val iri: String) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as IRI

        if (iri != other.iri) return false

        return true
    }

    override fun hashCode(): Int {
        return iri.hashCode()
    }

    override fun toString(): String {
        return "IRI(iri='$iri')"
    }
}
