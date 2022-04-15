package coop.polypoly.core

import Failure
import FeatureManifest
import java.nio.ByteBuffer

class Core {
    companion object {
        fun bootstrapCore(languageCode: String): Result<Unit> {
            val bytes = JniApi().bootstrapCore(languageCode)
            val response = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(
                ByteBuffer.wrap(bytes))
            response.failure?.let {
                return Result.failure(InternalCoreException.make("Core bootstrap", it))
            }
            return Result.success(Unit)
        }

        @ExperimentalUnsignedTypes
        fun parseFeatureManifest(json: String): Result<FeatureManifest> {
            val failureContext = "Feature Manifest Parsing"
            val bytes = JniApi().parseFeatureManifest(json)
            val response = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(
                ByteBuffer.wrap(bytes))

            when (response.resultType) {
                FeatureManifestParsingResult.FeatureManifest -> {
                    response.result(FeatureManifest())?.let {
                        return Result.success(it as FeatureManifest)
                    }
                    return Result.failure(InvalidFeatureManifestContentException(failureContext))
                }
                FeatureManifestParsingResult.Failure -> {
                    response.result(Failure())?.let {
                        return Result.failure(InternalCoreException.make(failureContext, it as Failure))
                    }
                    return Result.failure(InvalidFailureContentException(failureContext))
                }
                else -> {
                    return Result.failure(InvalidResultException.make(failureContext, response.resultType.toString()))
                }
            }
        }
    }
}
