import XCTest

class OnboardingTest: XCTestCase {
    let app = XCUIApplication()
    
    override func setUp() {
        continueAfterFailure = false
    }
    
    func testOnboardingShowsUp() {
        launchApp(firstRun: true)
        // TODO: Assert onboarding screen is shown
        XCTAssertTrue(true)
    }

    private func launchApp(firstRun: Bool = false, resetDefaults: Bool = true) {
        typealias Keys = UserDefaults.Keys
        app.launchArguments = [
            "-\(Keys.firstRun.rawValue)",
            "\(firstRun)",
        ]
        print(firstRun)
        if resetDefaults {
            app.launchArguments += [
                "-\(Keys.resetUserDefaults.rawValue)",
                "true"
            ]
        }
        app.launch()
    }
/*
    private func assertInAppNotificationShown() {
        XCTAssertTrue(
            findInAppNotificationCloseButton().exists,
            "In app notification was supposed to be shown"
        )
    }
    
    private func assertInAppNotificationNotShown() {
        XCTAssertTrue(
            !findInAppNotificationCloseButton().exists,
            "In app notification was not supposed to be shown"
        )
    }
    
    private func findInAppNotificationCloseButton() -> XCUIElement {
        return app.buttons["OK"]
    }
 */
}
