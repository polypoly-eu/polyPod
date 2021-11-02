package coop.polypoly.polypod.updatenotification

import android.content.Context
import coop.polypoly.polypod.Preferences
import coop.polypoly.polypod.R

class UpdateNotification(private val context: Context) {
    // Reassignable for testing purposes
    var id = context.resources.getInteger(R.integer.update_notification_id)
    val title = context.getString(R.string.update_notification_title)
    val text = context.getString(R.string.update_notification_text)
    val pushDelay =
        context.resources.getInteger(R.integer.update_notification_push_delay)

    val inAppNotificationSeen: Boolean
        get() = id == 0 || Preferences.getSeenInAppNotificationId(context) == id

    val pushNotificationSeen: Boolean
        get() = id == 0 || Preferences.getSeenPushNotificationId(context) == id

    fun markInAppNotificationSeen() {
        Preferences.setSeenInAppNotificationId(context, id)
    }

    fun markPushNotificationSeen() {
        Preferences.setSeenPushNotificationId(context, id)
    }
}
