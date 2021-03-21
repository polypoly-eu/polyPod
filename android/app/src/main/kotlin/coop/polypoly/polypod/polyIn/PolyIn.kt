package coop.polypoly.polypod.polyIn

import coop.polypoly.polypod.polyIn.rdf.Matcher
import coop.polypoly.polypod.polyIn.rdf.Quad
import org.apache.jena.rdf.model.Model
import org.msgpack.core.MessageFormat
import org.msgpack.core.MessagePack
import org.apache.jena.rdf.model.ModelFactory
import java.io.File


open class PolyIn {
    open suspend fun select(matcher: Matcher): List<Quad> {
        var retList: List<Quad> = listOf()
        File("database.json").inputStream().use { inputStream ->
            MessagePack.newDefaultUnpacker(inputStream).use { unpacker ->
                while (unpacker.hasNext()) {
                    val vmt: MessageFormat = unpacker.nextFormat
                    retList = retList.plus(
                        Quad.codec.decode(unpacker.unpackValue())
                    )
                }
            }
        }
        return retList
    }

    open suspend fun add(quads: List<Quad>) {
        // create an empty Model
        File("database.json").outputStream().use { out ->
            model.write(out)

            MessagePack.newDefaultPacker(out).use { packer ->
                for (quad in quads) {
                    Quad.codec.encode(quad).writeTo(packer)
                }
            }
        }
    }
}
