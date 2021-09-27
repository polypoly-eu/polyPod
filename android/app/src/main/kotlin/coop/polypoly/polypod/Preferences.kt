package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager
import org.json.JSONObject

class Preferences {
    companion object {
        private const val firstRunKey = "firstRun"
        private const val seenInAppNotificationIdKey = "seenInAppNotificationId"
        private const val seenPushNotificationIdKey = "seenPushNotificationId"
        private const val biometricCheckKey = "biometricCheck"
        private const val fsKey = ""

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

        fun setBiometricCheck(context: Context, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(biometricCheckKey, shouldCheck)
            edit.commit()
        }

        fun getBiometricCheck(context: Context): Boolean =
            getPrefs(context).getBoolean(biometricCheckKey, true)

        fun setFileSystem(context: Context, fs: Map<String, String>) {
            val edit = getPrefs(context).edit()
            edit.putString(fsKey, JSONObject(fs).toString())
            edit.commit()
        }

        fun getFileSystem(context: Context): Map<String, String> {
            val outputMap = HashMap<String, String>()
            val jsonString = getPrefs(context).getString(fsKey, "{}")
            if (jsonString == null) {
                throw Error("File system error")
            }
            val jsonObject = JSONObject(jsonString)
            val keysItr: Iterator<String> = jsonObject.keys()
            while (keysItr.hasNext()) {
                val k = keysItr.next()
                val v = jsonObject.get(k) as String
                outputMap.put(k, v)
            }
            return outputMap
        }

        var currentFeatureName: String? = null
    }
}
