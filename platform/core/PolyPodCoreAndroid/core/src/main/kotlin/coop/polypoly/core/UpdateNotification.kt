package coop.polypoly.core

class UpdateNotification {
    companion object {
        val showInApp get() = Core.executeRequest(
            CoreRequest.GetShowInAppNotification(),
            Boolean::fromValue
        )

        val showPush get() = Core.executeRequest(
            CoreRequest.GetShowPushNotification(),
            Boolean::fromValue
        )

        fun handlePushSeen() =
            Core.executeRequest(CoreRequest.HandlePushNotificationSeen())

        fun handleInAppSeen() =
            Core.executeRequest(CoreRequest.HandleInAppNotificationSeen())
    }
}
