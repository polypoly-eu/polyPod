package coop.polypoly.core

import Failure
import FeatureManifest
import java.nio.ByteBuffer

@ExperimentalUnsignedTypes
class Core {
    companion object {
        fun bootstrapCore(languageCode: String): Result<Unit> {
            val bytes = JniApi().bootstrapCore(languageCode)
            val response = CoreBootstrapResponse.getRootAsCoreBootstrapResponse(
                ByteBuffer.wrap(bytes)
            )
            response.failure?.let {
                return Result.failure(
                    InternalCoreException.make("Core bootstrap", it)
                )
            }
            return Result.success(Unit)
        }

        fun parseFeatureManifest(json: String): Result<FeatureManifest> {
            val failureContext = "Feature Manifest Parsing"
            val bytes = JniApi().parseFeatureManifest(json)
            val response = FeatureManifestParsingResponse
                .getRootAsFeatureManifestParsingResponse(ByteBuffer.wrap(bytes))

            when (response.resultType) {
                FeatureManifestParsingResult.FeatureManifest -> {
                    val manifest = response.result(FeatureManifest())
                    if (manifest == null) {
                        return Result.failure(
                            MissingFeatureManifestContentException(
                                failureContext
                            )
                        )
                    }
                    return Result.success(manifest as FeatureManifest)
                }
                FeatureManifestParsingResult.Failure -> {
                    val failure = response.result(Failure())
                    if (failure == null) {
                        return Result.failure(
                            MissingFailureContentException(failureContext)
                        )
                    }
                    return Result.failure(
                        InternalCoreException.make(
                            failureContext,
                            failure as Failure
                        )
                    )
                }
                else -> {
                    return Result.failure(
                        InvalidResultException.make(
                            failureContext,
                            response.resultType.toString()
                        )
                    )
                }
            }
        }
    }
}
