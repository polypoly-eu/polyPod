package coop.polypoly.core

class UpdateNotification {
    companion object {
        val showInApp get() = Core.executeRequest(
            CoreRequest.ShouldShowInAppNotification(),
            Boolean::fromValue
        )

        val showPush get() = Core.executeRequest(
            CoreRequest.ShouldShowPushNotification(),
            Boolean::fromValue
        )

        fun handlePushSeen() =
            Core.executeRequest(CoreRequest.HandlePushNotificationSeen())

        fun handleInAppSeen() =
            Core.executeRequest(CoreRequest.HandleInAppNotificationSeen())
    }
}
