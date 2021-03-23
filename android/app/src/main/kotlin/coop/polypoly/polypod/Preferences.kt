package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager

class Preferences {
    companion object {
        private const val firstRunKey = "firstRun"
        private const val seenInAppNotificationIdKey = "seenInAppNotificationId"
        private const val seenPushNotificationIdKey = "seenPushNotificationId"

        private fun getPrefs(context: Context) =
            PreferenceManager.getDefaultSharedPreferences(context)

        fun isFirstRun(context: Context): Boolean =
            getPrefs(context).getBoolean(firstRunKey, true)

        fun setFirstRun(context: Context, firstRun: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(firstRunKey, firstRun)
            edit.commit()
        }

        fun getSeenInAppNotificationId(context: Context): Int =
            getPrefs(context).getInt(seenInAppNotificationIdKey, 0)

        fun setSeenInAppNotificationId(
            context: Context,
            seenNotificationId: Int
        ) {
            val edit = getPrefs(context).edit()
            edit.putInt(seenInAppNotificationIdKey, seenNotificationId)
            edit.commit()
        }

        fun getSeenPushNotificationId(context: Context): Int =
            getPrefs(context).getInt(seenPushNotificationIdKey, 0)

        fun setSeenPushNotificationId(
            context: Context,
            seenPushNotificationId: Int
        ) {
            val edit = getPrefs(context).edit()
            edit.putInt(seenPushNotificationIdKey, seenPushNotificationId)
            edit.commit()
        }
    }
}
