package coop.polypoly.polypod.logging

import org.slf4j.Logger

/**
 * Think of it as a drop-in replacement for org.slf4j.LoggerFactory.
 * Why not just use org.slf4j.LoggerFactory? There seems no way to have a setup where:
 * 1. while running on the Android platform logging messages would end up in Logcat, and
 * 2. while executing tests on a regular JVM logging messages would end up on a console or in a file of my choosing.
 * Root problem is that there can only be one org.slf4j.impl.StaticLoggerBinder class on a classpath, but...
 *  - logback-android has one, but supports only Android platform (no logs in tests),
 *  - logback-classic has one, is fully configurable, but has no Android support (no logging on Android),
 *  - slf4j-android has one, but again has only Android support (no logs in tests).
 * What would be good is a library built on top of logback-classic that just adds Android support.
 * logback-android is a fork of logback-classic, they cannot be both on the classpath at the same time.
 * But using logback would anyway not be perfect, because it alone is >750kB and we're talking about mobile app.
 */
object LoggerFactory {

    fun getLogger(clazz: Class<*>?): Logger {
        return if (isAndroid())
            AndroidLogger("polyPod")
        else {
            org.slf4j.LoggerFactory.getLogger(clazz)
        }
    }

    private fun isAndroid(): Boolean {
        return System.getProperty("java.vm.name") == "Dalvik"
    }
}
