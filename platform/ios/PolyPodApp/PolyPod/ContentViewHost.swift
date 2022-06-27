import SwiftUI

class ContentViewHost: UIHostingController<ContentView> {
    private var statusBarStyle: UIStatusBarStyle = .default {
        didSet { setNeedsStatusBarAppearanceUpdate() }
    }
    init() {
        super.init(rootView: ContentView(featureStorage: .init(dataProtection: DataProtection.instance)))
        self.rootView.setStatusBarStyle = { self.statusBarStyle = $0 }
    }

    @available(*, unavailable)
    @objc required dynamic init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    override var preferredStatusBarStyle: UIStatusBarStyle { statusBarStyle }
}
