import Foundation

public protocol CoreLog {
    func debug(_ message: String)
    func info(_ message: String)
    func error(_ message: String)
}
