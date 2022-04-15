package coop.polypoly.core
import Failure

class InternalCoreException(message: String) : Exception(message) {
    companion object {
        fun make(context: String, failure: Failure): InternalCoreException {
            return InternalCoreException("$context -> internal Core Failure: ${failure.code} ${failure.message}")
        }
    }
}

class InvalidResultException(message: String) : Exception(message) {
    companion object {
        fun make(context: String, result: String): InvalidResultException {
            return InvalidResultException("$context -> received invalid result type: $result")
        }
    }
}

class InvalidFailureException(message: String) : Exception(message) {
    companion object {
        fun make(context: String): InvalidFailureException {
            return InvalidFailureException("$context -> recevied failure result type without failure content")
        }
    }
}
