import LocalAuthentication
import PolyPodCoreSwift
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
        .onReceive(NotificationCenter.default.publisher(for: UIApplication.didEnterBackgroundNotification)) { _ in
            _ = Core
                .instance
                .executeRequest(.handleAppDidBecomeInactive)
                .inspectError({ error in
                    Log.error("Failed to notify core that app did become inactive \(error)")
                })
        }
        .onReceive(NotificationCenter.default.publisher(for: UIApplication.didBecomeActiveNotification)) { _ in
            checkIfUserSessionDidExpire()
        }
    }

    private func checkIfUserSessionDidExpire() {
        if !Authentication.shared.shouldShowPrompt() {
            let isExpired = Core
                .instance
                .executeRequest(.isUserSessionExpired)
                .inspectError({ error in
                    Log.error("Failed to retrieve user session status \(error)")
                })
                .unwrapOr(true)
            if isExpired {
                self.state = ViewState(
                    AnyView(
                        UnlockPolyPod(onCompleted: {
                            // Checking whether a notification needs to be shown
                            // used to be in featureListState, where it makes more
                            // sense, but ever since we added a dedicated
                            // lockedState, they wouldn't show up anymore, the
                            // state change in featureListState's onAppear did not
                            // trigger a rerender, even though it should.
                            // Yet another SwiftUI bug it seems...
                            showUpdateNotification = UpdateNotification.showInApp

                            state = featureListState()
                        })
                    )
                )
            }
        }
    }

    private func initState() -> ViewState {
        let state = self.state ?? firstRunState()
        setStatusBarStyle?(
            state.backgroundColor.isLight ? .darkContent : .lightContent
        )
        return state
    }

    private func firstRunState() -> ViewState {
        if !FirstRun.read() {
            return securityReminderState()
        }

        _ = Core.instance.executeRequest(.handleFirstRun).inspectError {
            Log.error("handleFirstRun request failed: \($0.localizedDescription)")
        }
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
                        showUpdateNotification = UpdateNotification.showInApp

                        state = featureListState()
                    })
                )
            )
        }
        if Authentication.shared.shouldShowOnboardingScreen() {
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

        return featureListState()
    }

    private func featureListState() -> ViewState {
        let notificationData = UpdateNotificationData()
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
                        Log.info("Navigation: Opened \(featureId) feature.")
                        state = featureState(feature)
                    },
                    openInfoAction: {
                        state = infoState()
                    }
                ).alert(isPresented: $showUpdateNotification) {
                    Alert(
                        title: Text(notificationData.title),
                        message: Text(notificationData.text),
                        dismissButton: .default(
                            Text("button_update_notification_close")
                        ) {
                            UpdateNotification.handleInAppSeen()
                            showUpdateNotification = UpdateNotification.showInApp
                        }
                    )
                }
            )
        )
    }

    private func featureState(_ feature: Feature) -> ViewState {
        ViewState(
            backgroundColor: Color(fromHex: feature.primaryColor),
            borderColor: Color(fromHex: feature.borderColor),
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
}
