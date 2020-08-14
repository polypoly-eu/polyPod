package eu.polypoly.pod.android.logging

import android.util.Log
import org.slf4j.Logger
import org.slf4j.Marker

/**
 * Translating from SLF4J's Logger to Android's Log API.
 * TRACE -> VERBOSE
 */
class AndroidLogger(val tag: String) : Logger {

    override fun warn(msg: String) {
        Log.w(tag, msg)
    }

    override fun warn(format: String, arg: Any) {
        TODO("Not yet implemented")
    }

    override fun warn(format: String, arg1: Any, arg2: Any) {
        TODO("Not yet implemented")
    }

    override fun warn(format: String, vararg arguments: Any) {
        TODO("Not yet implemented")
    }

    override fun warn(msg: String, t: Throwable) {
        Log.w(tag, msg, t)
    }

    override fun warn(marker: Marker, msg: String) {
        TODO("Sorry, no support for markers")
    }

    override fun warn(marker: Marker, format: String, arg: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun warn(marker: Marker, format: String, arg1: Any, arg2: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun warn(marker: Marker, format: String, vararg arguments: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun warn(marker: Marker, msg: String, t: Throwable) {
        TODO("Sorry, no support for markers")
    }

    override fun getName(): String {
        return tag
    }

    override fun info(msg: String) {
        Log.i(tag, msg)
    }

    override fun info(format: String, arg: Any) {
        TODO("Not yet implemented")
    }

    override fun info(format: String, arg1: Any, arg2: Any) {
        TODO("Not yet implemented")
    }

    override fun info(format: String, vararg arguments: Any) {
        TODO("Not yet implemented")
    }

    override fun info(msg: String, t: Throwable) {
        Log.i(tag, msg, t)
    }

    override fun info(marker: Marker, msg: String) {
        TODO("Sorry, no support for markers")
    }

    override fun info(marker: Marker, format: String, arg: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun info(marker: Marker, format: String, arg1: Any, arg2: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun info(marker: Marker, format: String, vararg arguments: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun info(marker: Marker, msg: String, t: Throwable) {
        TODO("Sorry, no support for markers")
    }

    override fun isErrorEnabled(): Boolean {
        return Log.isLoggable(tag, Log.ERROR)
    }

    override fun isErrorEnabled(marker: Marker): Boolean {
        TODO("Sorry, no support for markers")
    }

    override fun error(msg: String) {
        Log.e(tag, msg)
    }

    override fun error(format: String, arg: Any) {
        TODO("Not yet implemented")
    }

    override fun error(format: String, arg1: Any, arg2: Any) {
        TODO("Not yet implemented")
    }

    override fun error(format: String, vararg arguments: Any) {
        TODO("Not yet implemented")
    }

    override fun error(msg: String, t: Throwable) {
        Log.e(tag, msg, t)
    }

    override fun error(marker: Marker, msg: String) {
        TODO("Sorry, no support for markers")
    }

    override fun error(marker: Marker, format: String, arg: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun error(marker: Marker, format: String, arg1: Any, arg2: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun error(marker: Marker, format: String, vararg arguments: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun error(marker: Marker, msg: String, t: Throwable) {
        TODO("Sorry, no support for markers")
    }

    override fun isDebugEnabled(): Boolean {
        return Log.isLoggable(tag, Log.DEBUG)
    }

    override fun isDebugEnabled(marker: Marker): Boolean {
        TODO("Sorry, no support for markers")
    }

    override fun debug(msg: String) {
        Log.d(tag, msg)
    }

    override fun debug(format: String, arg: Any) {
        TODO("Not yet implemented")
    }

    override fun debug(format: String, arg1: Any, arg2: Any) {
        TODO("Not yet implemented")
    }

    override fun debug(format: String, vararg arguments: Any) {
        TODO("Not yet implemented")
    }

    override fun debug(msg: String, t: Throwable) {
        Log.d(tag, msg, t)
    }

    override fun debug(marker: Marker, msg: String) {
        TODO("Sorry, no support for markers")
    }

    override fun debug(marker: Marker, format: String, arg: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun debug(marker: Marker, format: String, arg1: Any, arg2: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun debug(marker: Marker, format: String, vararg arguments: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun debug(marker: Marker, msg: String, t: Throwable) {
        TODO("Sorry, no support for markers")
    }

    override fun isInfoEnabled(): Boolean {
        return Log.isLoggable(tag, Log.INFO)
    }

    override fun isInfoEnabled(marker: Marker): Boolean {
        TODO("Sorry, no support for markers")
    }

    override fun trace(msg: String) {
        Log.v(tag, msg)
    }

    override fun trace(format: String, arg: Any) {
        TODO("Not yet implemented")
    }

    override fun trace(format: String, arg1: Any, arg2: Any) {
        TODO("Not yet implemented")
    }

    override fun trace(format: String, vararg arguments: Any) {
        TODO("Not yet implemented")
    }

    override fun trace(msg: String, t: Throwable) {
        Log.v(tag, msg, t)
    }

    override fun trace(marker: Marker, msg: String) {
        TODO("Sorry, no support for markers")
    }

    override fun trace(marker: Marker, format: String, arg: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun trace(marker: Marker, format: String, arg1: Any, arg2: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun trace(marker: Marker, format: String, vararg argArray: Any) {
        TODO("Sorry, no support for markers")
    }

    override fun trace(marker: Marker, msg: String, t: Throwable) {
        TODO("Sorry, no support for markers")
    }

    override fun isWarnEnabled(): Boolean {
        return Log.isLoggable(tag, Log.WARN)
    }

    override fun isWarnEnabled(marker: Marker): Boolean {
        TODO("Sorry, no support for markers")
    }

    override fun isTraceEnabled(): Boolean {
        return Log.isLoggable(tag, Log.VERBOSE)
    }

    override fun isTraceEnabled(marker: Marker): Boolean {
        TODO("Sorry, no support for markers")
    }
}
