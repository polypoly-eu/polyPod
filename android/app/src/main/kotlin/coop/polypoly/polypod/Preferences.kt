package coop.polypoly.polypod

import android.content.Context
import androidx.preference.PreferenceManager

class Preferences {
    companion object {
        private const val firstRunKey = "firstRun"

        fun isFirstRun(context: Context): Boolean {
            val prefs = PreferenceManager.getDefaultSharedPreferences(context)
            return prefs.getBoolean(firstRunKey, true)
        }

        fun setFirstRun(context: Context, firstRun: Boolean) {
            val prefs = PreferenceManager.getDefaultSharedPreferences(context)
            val edit = prefs.edit()
            edit.putBoolean(firstRunKey,  firstRun)
            edit.commit()
        }
    }
}
