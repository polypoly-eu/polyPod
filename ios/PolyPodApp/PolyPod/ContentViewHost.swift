import SwiftUI

class ContentViewHost: UIHostingController<ContentView> {
    private var statusBarStyle: UIStatusBarStyle = .default {
        didSet { setNeedsStatusBarAppearanceUpdate() }
    }
    init() {
        super.init(rootView: ContentView())
        self.rootView.setStatusBarStyle = { self.statusBarStyle = $0 }
        let defaults = UserDefaults.standard
        if defaults.bool(forKey: UserDefaults.Keys.resetUserDefaults.rawValue) {
            print("Resetting all user defaults")
            UserDefaults.standard.reset()
        }
    }
    
    @objc required dynamic init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle { statusBarStyle }
}
