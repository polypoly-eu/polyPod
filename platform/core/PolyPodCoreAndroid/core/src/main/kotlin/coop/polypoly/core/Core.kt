package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value

class Core {
    companion object {
        fun bootstrapCore(languageCode: String, fsRoot: String) {
            return handleCoreResponse(
                JniApi.bootstrapCore(
                    languageCode,
                    fsRoot,
                    JniApi
                )
            ) {}
        }

        fun loadFeatureCategories(featuresDir: String): List<FeatureCategory> {
            return handleCoreResponse(
                JniApi.loadFeatureCategories(featuresDir)
            ) { mapFeatureCategories(it) }
        }

        fun execRdfQuery(query: String): Value {
            return handleCoreResponse(
                JniApi.execRdfQuery(query)
            ) { it }
        }

        fun execRdfUpdate(query: String) {
            return handleCoreResponse(
                JniApi.execRdfUpdate(query)
            ) {}
        }

        fun execFeatureRdfQuery(query: String): Value {
            return handleCoreResponse(
                JniApi.execFeatureRdfQuery(query)
            ) { it }
        }

        fun execFeatureRdfUpdate(query: String) {
            return handleCoreResponse(
                JniApi.execFeatureRdfUpdate(query)
            ) {}
        }

        fun openFeatureRdfStore() {
            return handleCoreResponse(
                JniApi.openFeatureRdfStore()
            ) {}
        }

        fun appDidBecomeInactive() {
            return handleCoreResponse(
                JniApi.appDidBecomeInactive()
            ) {}
        }

        fun didOpenFeature(featureId: String) {
            return handleCoreResponse(
                JniApi.didOpenFeature(featureId)
            ) {}
        }

        fun isUserSessionExpired(): Boolean {
            return handleCoreResponse(
                JniApi.isUserSessionExpired()
            ) { it.asBooleanValue().boolean }
        }

        fun getUserSessionTimeoutOption(): UserSessionTimeoutOption {
            return handleCoreResponse(
                JniApi.getUserSessionTimeoutOption()
            ) { UserSessionTimeoutOption.from(it) }
        }

        fun getUserSessionTimeoutOptionsConfig():
            List<UserSessionTimeoutOptionConfig> {
            return handleCoreResponse(
                JniApi.getUserSessionTimeoutOptionsConfig()
            ) { UserSessionTimeoutOptionConfig.mapConfigs(it) }
        }

        fun setUserSessionTimeoutOption(option: UserSessionTimeoutOption) {
            return handleCoreResponse(
                JniApi.setUserSessionTimeoutOption(option.asValue().pack())
            ) {}
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
                throw mapError(it.asMapValue().map())
            }

            throw InvalidCoreResponseFormat(responseObject.toString())
        }
    }
}
