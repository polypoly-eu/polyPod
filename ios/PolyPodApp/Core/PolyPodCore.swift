// Please remove this line and the empty one after it

import Foundation
import PolyPodCore

final class PolyPodCore {
    static let instance = PolyPodCore()
    let corePointer: OpaquePointer
    
    private let containerPath: UnsafePointer<CChar>
    
    init() {
        // TODO: Handle possible errors
        let path = try! FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: false).path
        containerPath = NSString(string: path).utf8String!
        
        corePointer = new_core(.init(tag: .init(0), .init(.init(default_: containerPath))))
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
