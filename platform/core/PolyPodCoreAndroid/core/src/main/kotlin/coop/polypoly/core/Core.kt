package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value

class Core {
    companion object {
        fun bootstrapCore(args: BootstrapArgs) {
            return handleCoreResponse(
                JniApi.bootstrapCore(
                    args.asValue().pack(),
                    JniApi
                )
            ) {}
        }

        fun <CoreResponse> executeRequest(
            request: CoreRequest,
            // TODO: Investigate the option of doing automatic decoding instead of asking for a decoder.
            decoder: (Value) -> CoreResponse
        ): CoreResponse {
            return handleCoreResponse(
                JniApi.executeRequest(request.asValue().pack())
            ) { decoder(it) }
        }

        fun executeRequest(
            request: CoreRequest
        ) {
            return handleCoreResponse(
                JniApi.executeRequest(request.asValue().pack())
            ) { }
        }

        private fun <T> handleCoreResponse(
            byteResponse: ByteArray,
            map: (Value) -> T
        ): T {
            val unpacker: MessageUnpacker =
                MessagePack.newDefaultUnpacker(byteResponse)
            val responseObject = unpacker.unpackValue().asMapValue().map()

            responseObject.get("Ok")?.also {
                return map(it)
            }

            responseObject.get("Err")?.also {
                throw CoreFailure.from(it)
            }

            throw InvalidCoreResponseFormat(responseObject.toString())
        }
    }
}
