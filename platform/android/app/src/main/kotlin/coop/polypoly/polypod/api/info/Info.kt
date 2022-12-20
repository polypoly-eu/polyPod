package coop.polypoly.polypod.api.info

import coop.polypoly.polypod.RuntimeInfo

open class Info {
    fun getRuntime() = RuntimeInfo.NAME
    fun getVersion() = RuntimeInfo.VERSION
}
