import XCTest

class OnboardingTest: XCTestCase {
    let app = XCUIApplication()
    
    override func setUp() {
        continueAfterFailure = false
    }
    
    func testOnboardingShowsUpOnFirstRun() {
        launchApp(firstRun: true)
        assertOnboardingCloseButtonShown()
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

    private func assertOnboardingCloseButtonShown() {
        XCTAssertTrue(
            findOnboardingCloseButton().exists,
            "Onboarding was supposed to be shown"
        )
    }
    
    private func findOnboardingCloseButton() -> XCUIElement {
        return app.buttons["app_bar_button_close_desc"]
    }
}
