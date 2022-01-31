import Foundation
import CocoaLumberjackSwift

enum Log {
    static func bootstrap() {
        DDLog.add(DDOSLogger.sharedInstance) // Write to os_log
        
        let fileLogger = DDFileLogger() // Write to a file
        fileLogger.rollingFrequency = 60 * 60 * 24 // 24 hours
        fileLogger.logFileManager.maximumNumberOfLogFiles = 7
        DDLog.add(fileLogger)
    }
    
    static func debug(_ message: String) {
        DDLogDebug(message)
    }
    
    static func info(_ message: String) {
        DDLogInfo(message)
    }
    
    static func error(_ message: String) {
        DDLogError(message)
    }
}

extension Log {
    static var logFiles: [URL] {
        guard let fileLogger = DDLog.allLoggers.compactMap({ $0 as? DDFileLogger }).first else { return [] }
        return fileLogger.logFileManager.sortedLogFilePaths.map { URL(fileURLWithPath: $0) }
    }
}
