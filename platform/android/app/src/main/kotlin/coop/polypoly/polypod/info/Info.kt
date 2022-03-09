package coop.polypoly.polypod.info

import coop.polypoly.polypod.RuntimeInfo

class Info {
    open fun getRuntime() = RuntimeInfo.NAME
    open fun getVersion() = RuntimeInfo.VERSION
}
