enum Log {
    static func debug(_ message: String) {
        Core.instance.log?.debug(message)
    }

    static func info(_ message: String) {
        Core.instance.log?.info(message)
    }

    static func error(_ message: String) {
        Core.instance.log?.error(message)
    }
}
