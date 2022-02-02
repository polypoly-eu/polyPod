// Please remove this line and the empty one after it

import Foundation
import PolyPodCore

final class PolyPodCore {
    static let instance = PolyPodCore()
    let corePointer: OpaquePointer
    
    init() {
        corePointer = new_core(UserDefaults.keyValueStore)
    }
}

extension PolyPodCore {
    var showInApp: Bool {
        show_in_app(corePointer)
    }
    
    var showPush: Bool {
        show_push(corePointer)
    }

    func handleStartup() {
        handle_startup(corePointer)
    }
    
    func handlePushSeen() {
        handle_push_seen(corePointer)
    }
    
    func handleFirstRun() {
        handle_first_run(corePointer)
    }
    
    func handleInAppSeen() {
        handle_in_app_seen(corePointer)
    }
}

extension OptionUsize {
    static func none() -> Self {
        .init(tag: .init(0), .init())
    }
    
    static func some(_ value: UInt) -> Self {
        .init(tag: .init(rawValue: 1), .init(.init(some: value)))
    }
}
