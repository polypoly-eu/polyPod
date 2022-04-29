package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager
import org.json.JSONObject

class Preferences {
    companion object {
        private const val authenticationKey = "authenticationKey"
        private const val firstRunKey = "firstRun"
        private const val lastNotificationIdKey = "lastNotificationId"
        private const val lastNotificationStateKey = "lastNotificationState"
        private const val biometricCheckKey = "biometricCheck"
        private const val biometricEnabledKey = "biometricEnabledKey"
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

        fun getLastNotification(context: Context) = getPrefs(context).let {
            Pair(
                it.getInt(lastNotificationIdKey, 0),
                it.getString(lastNotificationStateKey, null)
            )
        }

        fun setLastNotification(context: Context, id: Int, state: String) {
            val edit = getPrefs(context).edit()
            edit.putInt(lastNotificationIdKey, id)
            edit.putString(lastNotificationStateKey, state)
            edit.commit()
        }

        fun setAuthentication(context: String, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(authenticationKey, shouldCheck)
            edit.commit()
        }

        fun setBiometricCheck(context: Context, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(biometricCheckKey, shouldCheck)
            edit.commit()
        }

        fun getBiometricCheck(context: Context): Boolean =
            getPrefs(context).getBoolean(biometricCheckKey, true)

        fun setBiometricEnabled(context: Context, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(biometricEnabledKey, shouldCheck)
            edit.commit()
        }

        fun getBiometricEnabled(context: Context): Boolean =
            getPrefs(context).getBoolean(biometricEnabledKey, false)

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
    }
}
