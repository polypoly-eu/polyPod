package coop.polypoly.core

enum class CoreExceptionCode(val value: Int) {
    CoreNotBootstrapped(1),
    CoreAlreadyBootstrapped(2),
    FailedToParseFeatureManifest(3),
    NullCStringPointer(4),
    FailedToCreateCString(5),
    FailedToExtractJavaString(6),
    FailedToConvertJavaString(7);

    companion object {
        fun getByValue(value: Int) = values().firstOrNull { it.value == value }
    }
}

data class CoreFailure(
    val code: CoreExceptionCode,
    override val message: String
) : Exception("$code -> $message")

class InvalidCoreResponseFormat(val info: String) :
    Exception("Received invalid core response format: $info")
class EmptyFeatureManifest :
    Exception("The received feature manifest seems to be empty")
data class InvalidCoreErrorFormat(val info: String) :
    Exception("Received invalid core failure format: $info")
