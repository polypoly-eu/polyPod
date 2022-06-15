import XCTest

class OnboardingTest: XCTestCase {
    let app = XCUIApplication()
    
    override func setUp() {
        continueAfterFailure = false
    }
    
    func testOnboardingShowsUpOnFirstRun() {
        launchApp(firstRun: true)
        assertOnboardingIsShown()
    }
    
    func testOnboardingNotShownOnSubsequentRun() {
        launchApp()
        assertOnboardingIsNotShown()
    }
    
    private func launchApp(firstRun: Bool = false, resetDefaults: Bool = true) {
        typealias Keys = UserDefaults.Keys
        app.launchArguments = [
            "-\(Keys.firstRun.rawValue)",
            "\(firstRun)",
        ]
        if resetDefaults {
            app.launchArguments += [
                "-\(Keys.resetUserDefaults.rawValue)",
                "true"
            ]
        }
        app.launch()
    }
    
    private func assertOnboardingIsShown() {
        XCTAssertTrue(
            onboardingView().exists,
            "Onboarding was supposed to be shown"
        )
    }
    
    private func assertOnboardingIsNotShown() {
        XCTAssertFalse(
            onboardingView().exists,
            "Onboarding was not supposed to be shown"
        )
    }
    
    private func onboardingView() -> XCUIElement {
        return app.otherElements["onboarding_view"]
    }
}
