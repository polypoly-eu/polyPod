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
        
        corePointer = new_poly_pod_core(.default(containerPath))
        // or
        // corePointer = new_poly_pod_core(.custom(UserDefaults.keyValueStore))
    }
}

extension PolyPodCore {
    var showInApp: Bool {
        update_notification_show_in_app(corePointer)
    }
    
    var showPush: Bool {
        update_notification_show_push(corePointer)
    }

    func handleStartup() {
        update_notification_handle_startup(corePointer)
    }
    
    func handlePushSeen() {
        update_notification_handle_push_seen(corePointer)
    }
    
    func handleFirstRun() {
        update_notification_handle_first_run(corePointer)
    }
    
    func handleInAppSeen() {
        update_notification_handle_in_app_seen(corePointer)
    }
}

extension OptionKeyValueStore {
    static func `default`(_ path: UnsafePointer<CChar>) -> OptionKeyValueStore {
        .init(tag: .init(0), .init(.init(default_: path)))
    }
    
    static func custom(_ store: KeyValueStore) -> OptionKeyValueStore {
        .init(tag: .init(1), .init(.init(custom: store)))
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
