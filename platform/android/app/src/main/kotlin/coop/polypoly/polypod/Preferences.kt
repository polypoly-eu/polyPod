package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager
import org.json.JSONArray
import org.json.JSONObject

class Preferences {
    companion object {
        private const val firstRunKey = "firstRun"
        private const val lastNotificationIdKey = "lastNotificationId"
        private const val lastNotificationStateKey = "lastNotificationState"
        private const val biometricCheckKey = "biometricCheck"
        private const val biometricEnabledKey = "biometricEnabledKey"
        private const val userConfiguredAuth = "userConfiguredAuth "
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

        fun setSecurityDoNotAskAgainCheck(context: Context, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(biometricCheckKey, shouldCheck)
            edit.commit()
        }

        fun hasUserConfiguredAuthentication(context: Context): Boolean =
            getPrefs(context).getBoolean(userConfiguredAuth, false)

        fun setUserConfiguredAuthentication(context: Context, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(userConfiguredAuth, shouldCheck)
            edit.commit()
        }

        fun isSecurityDoNotAskAgainEnabled(context: Context): Boolean =
            getPrefs(context).getBoolean(biometricCheckKey, false)

        fun setBiometricEnabled(context: Context, shouldCheck: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(biometricEnabledKey, shouldCheck)
            edit.commit()
        }

        fun isBiometricEnabled(context: Context): Boolean =
            getPrefs(context).getBoolean(biometricEnabledKey, false)

        fun setFileSystem(context: Context, fs: Map<String, Array<String>>) {
            val edit = getPrefs(context).edit()
            edit.putString(fsKey, JSONObject(fs).toString())
            edit.commit()
        }

        fun getFileSystem(context: Context): Map<String, Array<String>> {
            val outputMap = HashMap<String, Array<String>>()
            val jsonString = getPrefs(context).getString(fsKey, "{}")
                ?: throw Error("File system error")
            val jsonObject = JSONObject(jsonString)
            val keysItr: Iterator<String> = jsonObject.keys()
            while (keysItr.hasNext()) {
                val k = keysItr.next()
                val list = mutableListOf<String>()
                val v = jsonObject.get(k)
                (v as? JSONArray)?.let {
                    for (i in 0 until it.length()) {
                        val s = it.get(i) as String
                        list.add(s)
                    }
                } ?: run {
                    // Migrate old data - we used to store only a single file
                    list.add(v as String)
                }
                outputMap[k] = list.toTypedArray()
            }
            return outputMap
        }
    }
}
