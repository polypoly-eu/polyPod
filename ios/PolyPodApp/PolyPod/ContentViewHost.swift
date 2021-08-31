import SwiftUI

class ContentViewHost: UIHostingController<ContentView> {
    private var statusBarStyle: UIStatusBarStyle = .default {
        didSet { setNeedsStatusBarAppearanceUpdate() }
    }
    init() {
        super.init(rootView: ContentView())
        self.rootView.setStatusBarStyle = { self.statusBarStyle = $0 }
    }
    
    @objc required dynamic init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override var preferredStatusBarStyle: UIStatusBarStyle { statusBarStyle }
}
