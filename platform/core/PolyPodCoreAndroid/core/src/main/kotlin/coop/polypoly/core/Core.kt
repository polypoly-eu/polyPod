package coop.polypoly.core

import org.msgpack.core.MessagePack
import org.msgpack.core.MessageUnpacker
import org.msgpack.value.Value
import org.msgpack.value.ValueFactory

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

        fun loadFeatureCategories(
            featuresDir: String,
            forceShow: List<FeatureCategoryId>
        ): List<FeatureCategory> {
            val args = mutableMapOf<Value, Value>()
            args[ValueFactory.newString("features_dir")] =
                ValueFactory.newString(featuresDir)
            args[ValueFactory.newString("force_show")] =
                ValueFactory.newArray(
                    forceShow.map { ValueFactory.newString(it.toString()) }
                )
            val bytes = ValueFactory.newMap(args).pack()
            return handleCoreResponse(JniApi.loadFeatureCategories(bytes)) {
                mapFeatureCategories(
                    it
                )
            }
        }

        fun appDidBecomeInactive() {
            return handleCoreResponse(
                JniApi.appDidBecomeInactive()
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
