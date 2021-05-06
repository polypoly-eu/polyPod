import UIKit

protocol PolyNavProtocol {
    func setTitle(title: String, completionHandler: ([ExtendedData]?, Error?) -> Void)
    func setActiveActions(actions: [String], completionHandler: ([ExtendedData]?, Error?) -> Void)
    func openUrl(target: String, completionHandler: ([ExtendedData]?, Error?) -> Void)
}

class PolyNav: PolyNavProtocol {
    func setTitle(title: String, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil, PolyApiError.unknown)
            return
        }
        
    }
    
    func setActiveActions(actions: [String], completionHandler: ([ExtendedData]?, Error?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil, PolyApiError.unknown)
            return
        }
    }
    
    func openUrl(target: String, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil, PolyApiError.unknown)
            return
        }
    }
    
}
