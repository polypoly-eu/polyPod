package coop.polypoly.core

import org.msgpack.value.Value

data class BootstrapArgs(
    val languageCode: String,
    val fsRoot: String
) {
    fun asValue(): Value {
        return mapOf(
            "languageCode".asValue() to languageCode.asValue(),
            "fsRoot".asValue() to fsRoot.asValue()
        ).asValue()
    }
}

data class LoadFeatureCategoriesArguments(
    val featuresDir: String,
    val forceShow: List<FeatureCategoryId>
) {
    fun asValue(): Value {
        return mapOf(
            "featuresDir".asValue() to featuresDir.asValue(),
            "forceShow".asValue() to
                forceShow.map { it.toString().asValue() }.asValue()
        ).asValue()
    }
}

sealed class CoreRequest {
    class LoadFeatureCategories(val args: LoadFeatureCategoriesArguments): CoreRequest()
    class AppDidBecomeInactive(): CoreRequest()
    class IsUserSessionExpired(): CoreRequest()
    class SetUserSessionTimeout(val args: UserSessionTimeoutOption): CoreRequest()
    class GetUserSessionTimeoutOption(): CoreRequest()
    class GetUserSessionTimeoutOptionsConfig(): CoreRequest()
    class ExecuteRdfQuery(val args: String): CoreRequest()
    class ExecuteRdfUpdate(val args: String): CoreRequest()

    fun asValue(): Value {
        return when (this) {
            is CoreRequest.LoadFeatureCategories -> mapOf(
                "loadFeatureCategories".asValue() to
                    mapOf("args".asValue() to args.asValue()).asValue()
            ).asValue()
            is CoreRequest.AppDidBecomeInactive -> "appDidBecomeInactive".asValue()
            is CoreRequest.IsUserSessionExpired -> "isUserSessionExpired".asValue()
            is CoreRequest.SetUserSessionTimeout -> mapOf(
                "setUserSessionTimeout".asValue() to
                    mapOf("args".asValue() to args.asValue()).asValue()
            ).asValue()
            is CoreRequest.GetUserSessionTimeoutOption -> "getUserSessionTimeoutOption".asValue()
            is CoreRequest.GetUserSessionTimeoutOptionsConfig -> "getUserSessionTimeoutOptionsConfig".asValue()
            is CoreRequest.ExecuteRdfQuery -> mapOf(
                "executeRdfQuery".asValue() to mapOf(
                    "args".asValue() to args.asValue()
                ).asValue()
            ).asValue()
            is CoreRequest.ExecuteRdfUpdate -> mapOf(
                "executedRdfUpdate".asValue() to mapOf(
                    "args".asValue() to args.asValue()
                ).asValue()
            ).asValue()
        }
    }
}
