package coop.polypoly.polypod

import android.content.Context

class Language {
    companion object {
        fun determine(context: Context): String {
            val supportedLocales = arrayOf("en", "de")
            val userLocale =
                context.resources.configuration.locales.getFirstMatch(
                    supportedLocales
                )
            return userLocale?.language ?: "en"
        }
    }
}
