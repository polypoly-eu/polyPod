package coop.polypoly.core

import FeatureManifestParsingResult
import FeatureManifest
import Failure
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

        @OptIn(ExperimentalUnsignedTypes::class)
        fun parseFeatureManifest(json: String): Result<FeatureManifest> {
            val bytes = JniApi().parseFeatureManifest(json)
            val response = FeatureManifestParsingResponse.getRootAsFeatureManifestParsingResponse(
                ByteBuffer.wrap(bytes))

            when (response.resultType) {
                FeatureManifestParsingResult.FeatureManifest -> {
                    response.result(FeatureManifest())?.let {
                        val manifest = it as FeatureManifest
                        return Result.success(manifest)
                    }
                    return Result.failure(InvalidFailureException("Feature Manifest Parsing"))
                }
                FeatureManifestParsingResult.Failure -> {
                    response.result(Failure())?.let {
                        val failure = it as Failure
                        return Result.failure(InternalCoreException.make("Feature Manifest Parsing", failure))
                    }
                    return Result.failure(InvalidFailureException.make("Feature Manifest Parsing"))
                }
                else -> {
                    return Result.failure(InvalidResultException.make("Feature Manifest Parsing", response.resultType.toString()))
                }
            }
        }
    }
}
