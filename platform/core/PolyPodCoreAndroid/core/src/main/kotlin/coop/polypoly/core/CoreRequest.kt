package coop.polypoly.core

import org.msgpack.value.Value

data class BootstrapArgs(
    val languageCode: String,
    val fsRoot: String,
    val updateNotificationId: Int,
) {
    fun asValue(): Value {
        return mapOf(
            "languageCode".asValue() to languageCode.asValue(),
            "fsRoot".asValue() to fsRoot.asValue(),
            "updateNotificationId".asValue() to updateNotificationId.asValue()
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

data class SetPreferenceArguments(
    val key: String,
    val value: String
) {
    fun asValue(): Value {
        return mapOf(
            "key".asValue() to key.asValue(),
            "value".asValue() to value.asValue()
        ).asValue()
    }
}

sealed class CoreRequest {
    class LoadFeatureCategories(
        val args: LoadFeatureCategoriesArguments
    ) : CoreRequest()
    class HandleAppDidBecomeInactive() : CoreRequest()
    class IsUserSessionExpired() : CoreRequest()
    class SetUserSessionTimeout(
        val args: UserSessionTimeoutOption
    ) : CoreRequest()
    class GetUserSessionTimeoutOption() : CoreRequest()
    class GetUserSessionTimeoutOptionsConfig() : CoreRequest()
    class ExecuteRdfQuery(val args: String) : CoreRequest()
    class ExecuteRdfUpdate(val args: String) : CoreRequest()
    class HandleStartup : CoreRequest()
    class HandleFirstRun : CoreRequest()
    class HandleInAppNotificationSeen : CoreRequest()
    class HandlePushNotificationSeen : CoreRequest()
    class GetShowInAppNotification : CoreRequest()
    class GetShowPushNotification : CoreRequest()
    class ClearPreferences : CoreRequest()
    class SetPreference(val args: SetPreferenceArguments) : CoreRequest()

    // TODO: Investigate the option of doing automatic encoding
    fun asValue(): Value {
        return when (this) {
            is CoreRequest.LoadFeatureCategories -> mapOf(
                "loadFeatureCategories".asValue() to
                    mapOf("args".asValue() to args.asValue()).asValue()
            ).asValue()
            is CoreRequest.HandleAppDidBecomeInactive ->
                "handleAppDidBecomeInactive".asValue()
            is CoreRequest.IsUserSessionExpired ->
                "isUserSessionExpired".asValue()
            is CoreRequest.SetUserSessionTimeout -> mapOf(
                "setUserSessionTimeout".asValue() to
                    mapOf("args".asValue() to args.asValue()).asValue()
            ).asValue()
            is CoreRequest.GetUserSessionTimeoutOption ->
                "getUserSessionTimeoutOption".asValue()
            is CoreRequest.GetUserSessionTimeoutOptionsConfig ->
                "getUserSessionTimeoutOptionsConfig".asValue()
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
            is HandleStartup -> "handleStartup".asValue()
            is HandleFirstRun -> "handleFirstRun".asValue()
            is HandleInAppNotificationSeen ->
                "handleInAppNotificationSeen".asValue()
            is HandlePushNotificationSeen ->
                "handlePushNotificationSeen".asValue()
            is GetShowInAppNotification -> "getShowInAppNotification".asValue()
            is GetShowPushNotification -> "getShowPushNotification".asValue()
            is ClearPreferences -> "clearPreferences".asValue()
            is SetPreference -> mapOf(
                "setPreference".asValue() to mapOf(
                    "args".asValue() to args.asValue()
                ).asValue()
            ).asValue()
        }
    }
}
