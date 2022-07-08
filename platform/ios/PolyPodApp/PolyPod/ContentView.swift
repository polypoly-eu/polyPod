import LocalAuthentication
import SwiftUI

// TODO: This, and other user defaults we use, should move to a central place.
struct FirstRun {
    private static let key = UserDefaults.Keys.firstRun.rawValue

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
        let borderColor: Color

        let view: AnyView

        init(
            backgroundColor: Color? = nil,
            borderColor: Color? = nil,
            _ view: AnyView
        ) {
            self.backgroundColor =
                backgroundColor ?? Color.PolyPod.lightBackground
            self.borderColor = borderColor ?? Color.PolyPod.grey300Foreground
            self.view = view
        }
    }

    @State private var state: ViewState?
    @State private var showUpdateNotification = false
    var featureStorage: FeatureStorage
    var setStatusBarStyle: ((UIStatusBarStyle) -> Void)?

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
                OnboardingView(
                    closeAction: {
                        FirstRun.write(false)
                        state = featureListState()
                    }
                )
            )
        )
    }

    private func securityReminderState() -> ViewState {
        if !Authentication.shared.shouldShowPrompt() {
            return ViewState(
                AnyView(
                    UnlockPolyPod(onCompleted: {
                        // Checking whether a notification needs to be shown
                        // used to be in featureListState, where it makes more
                        // sense, but ever since we added a dedicated
                        // lockedState, they wouldn't show up anymore, the
                        // state change in featureListState's onAppear did not
                        // trigger a rerender, even though it should.
                        // Yet another SwiftUI bug it seems...
                        showUpdateNotification = UpdateNotification().showInApp

                        state = featureListState()
                    })
                )
            )
        }
        return featureListState() 
    }

    private func featureListState() -> ViewState {
        let notification = UpdateNotification()
        return ViewState(
            backgroundColor: HomeScreenConstants.View.backgroundColor,
            AnyView(
                HomeScreenView(
                    viewModel: .init(
                        storage: HomeScreenStorageAdapter(featureStorage: featureStorage)),
                    openFeatureAction: { featureId in
                        guard let feature = featureStorage.featureForId(featureId) else {
                            return
                        }
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
            borderColor: feature.borderColor,
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
                OnboardingView(
                    closeAction: {
                        state = featureListState()
                    }
                )
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
