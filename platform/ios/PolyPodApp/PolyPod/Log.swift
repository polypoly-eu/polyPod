import Foundation
import os.log

class Log {
    static let log = OSLog(
        subsystem: Bundle.main.bundleIdentifier!,
        category: "application"
    )
    
    static func debug(_ message: String) {
        log(.debug, message)
    }
    
    static func info(_ message: String) {
        log(.info, message)
    }
    
    static func error(_ message: String) {
        log(.error, message)
    }
    
    private static func log(_ type: OSLogType, _ message: String) {
        os_log("%s", log: log, type: type, message)
    }
}
