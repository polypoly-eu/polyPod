import XCTest

class UpdateNotificationTest: XCTestCase {
    let app = XCUIApplication()
    
    override func setUp() {
        continueAfterFailure = false
    }
    
    func testIgnoredNotification() {
        launchApp(0)
        assertInAppNotificationNotShown()
    }
    
    func testFirstNotificationShown() {
        launchApp(1)
        assertInAppNotificationShown()
    }
    
    func testNotificationShownOnlyOnce() {
        launchApp(1)
        assertInAppNotificationShown()
        closeInAppNotification()
        launchApp(1, resetDefaults: false)
        assertInAppNotificationNotShown()
    }
    
    func testNotificationShownAgainIfNotClosed() {
        launchApp(1)
        assertInAppNotificationShown()
        launchApp(1, resetDefaults: false)
        assertInAppNotificationShown()
    }
    
    func testNotificationWithDifferentIdShown() {
        launchApp(1)
        assertInAppNotificationShown()
        closeInAppNotification()
        launchApp(2, resetDefaults: false)
        assertInAppNotificationShown()
    }

    // TODO: Add tests that verify that the push notification shows up.
    
    private func launchApp(
        _ mockNotificationId: Int,
        resetDefaults: Bool = true
    ) {       
        typealias Keys = UserDefaults.Keys
        app.launchArguments = [
            "-\(Keys.firstRun.rawValue)",
            "false",
            "-\(Keys.updateNotificationMockId.rawValue)",
            "\(mockNotificationId)"
        ]
        if resetDefaults {
            app.launchArguments += [
                "-\(Keys.resetUserDefaults.rawValue)",
                "true"
            ]
        }
        app.launch()
    }

    private func assertInAppNotificationShown() {
        XCTAssertTrue(
            findInAppNotification().exists,
            "In app notification was supposed to be shown"
        )
    }
    
    private func assertInAppNotificationNotShown() {
        XCTAssertTrue(
            !findInAppNotification().exists,
            "In app notification was not supposed to be shown"
        )
    }
    
    private func findInAppNotification() -> XCUIElement {
        let predicate = NSPredicate(
            format: "label CONTAINS %@",
            UpdateNotification().title
        )
        return app.staticTexts.matching(predicate).firstMatch
    }
    
    private func closeInAppNotification() {
        app.buttons["OK"].tap()
    }
}
