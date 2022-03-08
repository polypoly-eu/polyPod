package coop.polypoly.polypod.logging

import android.util.Log
import org.slf4j.Logger
import org.slf4j.Marker
import org.slf4j.helpers.MessageFormatter

/**
 * Translating from SLF4J's Logger to Android's Log API.
 * TRACE -> VERBOSE
 */
class AndroidLogger(val tag: String) : Logger {

    override fun warn(msg: String) {
        if (isWarnEnabled)
            Log.w(tag, msg)
    }

    override fun warn(format: String, arg: Any) {
        if (isWarnEnabled) {
            val msg = MessageFormatter.format(format, arg)
            Log.w(tag, msg.message)
        }
    }

    override fun warn(format: String, arg1: Any, arg2: Any) {
        if (isWarnEnabled) {
            val msg = MessageFormatter.format(format, arg1, arg2)
            Log.w(tag, msg.message)
        }
    }

    override fun warn(format: String, vararg arguments: Any) {
        if (isWarnEnabled) {
            val msg = MessageFormatter.arrayFormat(format, arguments)
            Log.w(tag, msg.message)
        }
    }

    override fun warn(msg: String, t: Throwable) {
        if (isWarnEnabled)
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
        if (isInfoEnabled)
            Log.i(tag, msg)
    }

    override fun info(format: String, arg: Any) {
        if (isInfoEnabled) {
            val msg = MessageFormatter.format(format, arg)
            Log.i(tag, msg.message)
        }
    }

    override fun info(format: String, arg1: Any, arg2: Any) {
        if (isInfoEnabled) {
            val msg = MessageFormatter.format(format, arg1, arg2)
            Log.i(tag, msg.message)
        }
    }

    override fun info(format: String, vararg arguments: Any) {
        if (isInfoEnabled) {
            val msg = MessageFormatter.arrayFormat(format, arguments)
            Log.i(tag, msg.message)
        }
    }

    override fun info(msg: String, t: Throwable) {
        if (isInfoEnabled)
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
        if (isErrorEnabled)
            Log.e(tag, msg)
    }

    override fun error(format: String, arg: Any) {
        if (isErrorEnabled) {
            val msg = MessageFormatter.format(format, arg)
            Log.e(tag, msg.message)
        }
    }

    override fun error(format: String, arg1: Any, arg2: Any) {
        if (isErrorEnabled) {
            val msg = MessageFormatter.format(format, arg1, arg2)
            Log.e(tag, msg.message)
        }
    }

    override fun error(format: String, vararg arguments: Any) {
        if (isErrorEnabled) {
            val msg = MessageFormatter.arrayFormat(format, arguments)
            Log.e(tag, msg.message)
        }
    }

    override fun error(msg: String, t: Throwable) {
        if (isErrorEnabled)
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
        if (isDebugEnabled)
            Log.d(tag, msg)
    }

    override fun debug(format: String, arg: Any) {
        if (isDebugEnabled) {
            val msg = MessageFormatter.format(format, arg)
            Log.d(tag, msg.message)
        }
    }

    override fun debug(format: String, arg1: Any, arg2: Any) {
        if (isDebugEnabled) {
            val msg = MessageFormatter.format(format, arg1, arg2)
            Log.d(tag, msg.message)
        }
    }

    override fun debug(format: String, vararg arguments: Any) {
        if (isDebugEnabled) {
            val msg = MessageFormatter.arrayFormat(format, arguments)
            Log.d(tag, msg.message)
        }
    }

    override fun debug(msg: String, t: Throwable) {
        if (isDebugEnabled)
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
        if (isTraceEnabled)
            Log.v(tag, msg)
    }

    override fun trace(format: String, arg: Any) {
        if (isTraceEnabled) {
            val msg = MessageFormatter.format(format, arg)
            Log.v(tag, msg.message)
        }
    }

    override fun trace(format: String, arg1: Any, arg2: Any) {
        if (isTraceEnabled) {
            val msg = MessageFormatter.format(format, arg1, arg2)
            Log.v(tag, msg.message)
        }
    }

    override fun trace(format: String, vararg arguments: Any) {
        if (isTraceEnabled) {
            val msg = MessageFormatter.arrayFormat(format, arguments)
            Log.v(tag, msg.message)
        }
    }

    override fun trace(msg: String, t: Throwable) {
        if (isTraceEnabled)
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
