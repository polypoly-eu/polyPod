package coop.polypoly.core

import Failure

@ExperimentalUnsignedTypes
class InternalCoreException(message: String) : Exception(message) {
    companion object {
        fun make(context: String, failure: Failure): InternalCoreException {
            return InternalCoreException(
                "$context -> internal Core Failure: ${failure.code} ${failure.message}"
            )
        }
    }
}

class InvalidResultException(message: String) : Exception(message) {
    companion object {
        fun make(context: String, result: String): InvalidResultException {
            return InvalidResultException(
                "$context -> received invalid result type: $result"
            )
        }
    }
}

class MissingFailureContentException(context: String) :
    Exception("$context -> received failure result type without content")

class MissingFeatureManifestContentException(context: String) :
    Exception("$context -> received feature manifest result type without content")
