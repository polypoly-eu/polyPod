package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager
import coop.polypoly.core.Core
import coop.polypoly.core.CoreRequest
import coop.polypoly.core.SetPreferenceArguments
import coop.polypoly.polypod.logging.LoggerFactory
import org.json.JSONArray
import org.json.JSONObject
import kotlin.reflect.KClass

private data class MigratedPreference<T : Any>(
    val androidKey: String,
    val type: KClass<T>,
    val coreKey: String
)

class Preferences {
    companion object {
        private const val firstRunKey = "firstRun"
        private const val biometricCheckKey = "biometricCheck"
        private const val biometricEnabledKey = "biometricEnabledKey"
        private const val userConfiguredAuth = "userConfiguredAuth"
        private const val fsKey = ""
        private const val clearCorePreferencesKey = "clearCorePreferences"

        @Suppress("JAVA_CLASS_ON_COMPANION")
        private val logger = LoggerFactory.getLogger(javaClass.enclosingClass)

        private val migratedPreferences = listOf(
            MigratedPreference(
                "lastNotificationId",
                Int::class,
                "lastUpdateNotificationId"
            ),
            MigratedPreference(
                "lastNotificationState",
                String::class,
                "lastUpdateNotificationState"
            )
        )

        private fun getPrefs(context: Context) =
            PreferenceManager.getDefaultSharedPreferences(context)

        fun isFirstRun(context: Context): Boolean =
            getPrefs(context).getBoolean(firstRunKey, true)

        fun setFirstRun(context: Context, firstRun: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(firstRunKey, firstRun)
            edit.commit()
        }

        fun setSecurityDoNotAskAgainCheck(
            context: Context,
            shouldCheck: Boolean
        ) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(biometricCheckKey, shouldCheck)
            edit.commit()
        }

        fun isSecurityDoNotAskAgainEnabled(context: Context): Boolean =
            getPrefs(context).getBoolean(biometricCheckKey, false)

        fun hasUserConfiguredAuthentication(context: Context): Boolean =
            getPrefs(context).getBoolean(userConfiguredAuth, false)

        fun setUserConfiguredAuthentication(
            context: Context,
            shouldCheck: Boolean
        ) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(userConfiguredAuth, shouldCheck)
            edit.commit()
        }

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

        fun setClearCorePreferences(context: Context, clear: Boolean) {
            val edit = getPrefs(context).edit()
            edit.putBoolean(clearCorePreferencesKey, clear)
            edit.commit()
        }

        fun getClearCorePreferences(context: Context) =
            getPrefs(context).getBoolean(clearCorePreferencesKey, false)

        fun migrateToCore(context: Context) {
            val prefs = getPrefs(context)
            for (migratedPreference in migratedPreferences) {
                val androidKey = migratedPreference.androidKey
                val coreKey = migratedPreference.coreKey
                val value = when (val type = migratedPreference.type) {
                    String::class -> prefs.getString(androidKey, null)
                    Int::class -> {
                        val i = prefs.getInt(androidKey, -1)
                        if (i == -1) null else i.toString()
                    }
                    else -> throw Exception(
                        "Unsupported preference type: $type"
                    )
                } ?: return

                Core.executeRequest(
                    CoreRequest.SetPreference(
                        SetPreferenceArguments(coreKey, value)
                    )
                )
                prefs.edit().remove(androidKey).commit()
                logger.info("Migrated preference $androidKey as $coreKey")
            }
        }
    }
}
