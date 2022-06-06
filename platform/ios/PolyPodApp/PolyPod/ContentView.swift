import SwiftUI
import LocalAuthentication

// TODO: This, and other user defaults we use, should move to a central place.
struct FirstRun {
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
    @ObservedObject var featureStorage: FeatureStorage
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
            return lockedState()
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
    
    private func lockedState() -> ViewState {
        return ViewState(
            AnyView(
                Text("").onAppear {
                    authenticateRelentlessly {
                        // Checking whether a notification needs to be shown
                        // used to be in featureListState, where it makes more
                        // sense, but ever since we added a dedicated
                        // lockedState, they wouldn't show up anymore, the
                        // state change in featureListState's onAppear did not
                        // trigger a rerender, even though it should.
                        // Yet another SwiftUI bug it seems...
                        showUpdateNotification = UpdateNotification().showInApp
                        
                        state = featureListState()
                    }
                }
            )
        )
    }
    
    private func authenticateRelentlessly(
        _ completeAction: @escaping () -> Void
    ) {
        // Apple doesn't want us to close the app programmatically, e.g. in case
        // authentication fails. Since we don't have a dedicated screen for the
        // locked state yet, we simply keep asking the user until they stop
        // cancelling or leave the app.
        Authentication.shared.authenticate { success in
            if success {
                completeAction()
                return
            }
            authenticateRelentlessly(completeAction)
        }
    }
    
    private func featureListState() -> ViewState {
        let notification = UpdateNotification()
        return ViewState(
            AnyView(
                FeatureListView(
                    featureList: $featureStorage.featuresList,
                    openFeatureAction: { feature in
                        state = featureState(feature)
                    },
                    openInfoAction: {
                        state = infoState()
                    },
                    openSettingsAction: {
                        state = settingsState()
                    }
                ).alert(isPresented: $showUpdateNotification) {
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
                ChatView()
            )
        )
    }
}
