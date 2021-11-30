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
    
    private func initState() -> ViewState {
        let state = self.state ?? firstRunState()
        setStatusBarStyle?(
            state.backgroundColor.isLight ? .darkContent : .lightContent
        )
        return state
    }
    
    private func firstRunState() -> ViewState {
        let notification = UpdateNotification()
        notification.handleStartup()
        if !FirstRun.read() {
            return securityReminderState()
        }
        
        notification.handleFirstRun()
        return ViewState(
            AnyView(
                OnboardingView(closeAction: {
                    FirstRun.write(false)
                    state = featureListState()
                })
            )
        )
    }
    
    private func securityReminderState() -> ViewState {
        if !Authentication.shared.shouldShowPrompt() {
            return featureListState()
        }
        
        return ViewState(
            AnyView(
                OnboardingView(
                    securityOnly: true,
                    closeAction: {
                        state = featureListState()
                    }
                )
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
                        Authentication.shared.authenticate {
                            state = featureState(feature)
                        }
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
                            notification.handleInAppSeen()
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
