package coop.polypoly.polypod.polyIn.rdf

import eu.polypoly.bubblewrap.Codec
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

class Matcher(val subject: IRI?, val predicate: IRI?, val `object`: IRI?) {

    companion object {

        val codec: Codec<Matcher> = object : Codec<Matcher> {
            override fun encode(t: Matcher): Value {
                throw UnsupportedOperationException(
                    "Matcher should never be sent from the Pod to the Feature"
                )
            }

            override fun decode(value: Value): Matcher {
                val map = value.asMapValue().map()
                val subject = map[ValueFactory.newString("subject")]
                val predicate = map[ValueFactory.newString("predicate")]
                val `object` = map[ValueFactory.newString("object")]
                return Matcher(
                    if (subject != null) IRI.codec.decode(subject) else null,
                    if (predicate != null)
                        IRI.codec.decode(predicate)
                    else null,
                    if (`object` != null) IRI.codec.decode(`object`) else null
                )
            }
        }
    }
}
