import SwiftUI
import LocalAuthentication

private struct FirstRun {
    static private let key = UserDefaults.Keys.firstRun.rawValue
    
    static func read() -> Bool {
        if UserDefaults.standard.object(forKey: key) == nil {
            return true
        }
        return UserDefaults.standard.bool(forKey: key)
    }
    
    static func write(_ firstRun: Bool) {
        UserDefaults.standard.set(false, forKey: key)
    }
}

struct ContentView: View {
    private struct ViewState {
        let backgroundColor: Color
        let view: AnyView
        
        init(backgroundColor: Color? = nil, _ view: AnyView) {
            self.backgroundColor =
                backgroundColor ?? Color.PolyPod.lightBackground
            self.view = view
        }
    }
    
    @State private var state: ViewState? = nil
    @State private var showUpdateNotification = false
    var setStatusBarStyle: ((UIStatusBarStyle) -> Void)? = nil
    
    var body: some View {
        VStack(spacing: 0) {
            let state = initState()
            let safeAreaInsets = UIApplication.shared.windows[0].safeAreaInsets
            
            Rectangle()
                .fill(state.backgroundColor)
                .frame(maxWidth: .infinity, maxHeight: safeAreaInsets.top)
            
            state.view
            
            Rectangle()
                .fill(state.backgroundColor)
                .frame(maxWidth: .infinity, maxHeight: safeAreaInsets.bottom)
        }
        .edgesIgnoringSafeArea([.top, .bottom])
    }
    
    private func devicePasscodeSet() -> Bool {
        return LAContext().canEvaluatePolicy(.deviceOwnerAuthentication, error: nil)
    }
    
    private func checkSecurity() -> Void {
        let defaults = UserDefaults.standard
        let skipSecurityKey = UserDefaults.Keys.skipSecurity.rawValue
        let skipSecurity = defaults.value(forKey: skipSecurityKey) as? Bool ?? false
        if !skipSecurity && !devicePasscodeSet() {
            let alert = UIAlertController(
                title: NSLocalizedString(
                    "message_security_warning_title",
                    comment: ""
                ),
                message: NSLocalizedString(
                    "message_security_warning_text",
                    comment: ""
                ),
                preferredStyle: UIAlertController.Style.alert)
            alert.addAction(UIAlertAction(title: NSLocalizedString(
                "button_security_reject",
                comment: ""
            ), style: .default, handler: { (action: UIAlertAction!) in
                UserDefaults.standard.set(true, forKey: skipSecurityKey)
            })
            )
            
            alert.addAction(UIAlertAction(title: NSLocalizedString(
                "button_security_setup",
                comment: ""
            ), style: .default, handler: { (action: UIAlertAction!) in
                if let url = URL(string: "App-Prefs:root=TOUCHID_PASSCODE") {
                    UIApplication.shared.open(url)
                }
            })
            )
            UIApplication.shared.windows.first!.rootViewController!.present(alert, animated: true, completion:nil)
        }
    }
    
    private func initState() -> ViewState {
        checkSecurity()
        let state = self.state ?? firstRunState()
        setStatusBarStyle?(
            state.backgroundColor.isLight ? .darkContent : .lightContent
        )
        return state
    }
    
    private func firstRunState() -> ViewState {
        let notification = UpdateNotification()
        notification.onStartup()
        if !FirstRun.read() {
            return featureListState()
        }
        
        notification.onFirstRun()
        return ViewState(
            AnyView(
                OnboardingView(closeAction: {
                    FirstRun.write(false)
                    state = featureListState()
                })
            )
        )
    }
    
    private func featureListState() -> ViewState {
        let notification = UpdateNotification()
        return ViewState(
            AnyView(
                FeatureListView(
                    features: FeatureStorage.shared.featuresList(),
                    openFeatureAction: { feature in
                        state = featureState(feature)
                    },
                    openInfoAction: {
                        state = infoState()
                    },
                    openSettingsAction: {
                        state = settingsState()
                    }
                ).onAppear {
                    showUpdateNotification = notification.showInApp
                }.alert(isPresented: $showUpdateNotification) {
                    Alert(
                        title: Text(notification.title),
                        message: Text(notification.text),
                        dismissButton: .default(
                            Text("button_update_notification_close")
                        ) {
                            notification.onInAppSeen()
                            showUpdateNotification = notification.showInApp
                        }
                    )
                }
            )
        )
    }
    
    private func featureState(_ feature: Feature) -> ViewState {
        ViewState(
            backgroundColor: feature.primaryColor,
            AnyView(
                FeatureView(
                    feature: feature,
                    closeAction: {
                        state = featureListState()
                    }
                )
            )
        )
    }
    
    private func infoState() -> ViewState {
        ViewState(
            AnyView(
                OnboardingView(closeAction: {
                    state = featureListState()
                })
            )
        )
    }
    
    private func settingsState() -> ViewState {
        ViewState(
            AnyView(
                SettingsView(closeAction: {
                    state = featureListState()
                })
            )
        )
    }
}
