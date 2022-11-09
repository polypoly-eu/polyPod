import XCTest

class UpdateNotificationTest: XCTestCase {
    private let app = XCUIApplication()

    // swiftlint:disable empty_xctest_method
    override func setUp() {
        continueAfterFailure = false
    }
    // swiftlint:enable empty_xctest_method

    func testIgnoredNotification() {
        app.launchWithArgs(mockNotificationId: 0)

        assertInAppNotificationNotShown()
    }

    func testFirstNotificationShown() {
        app.launchWithArgs(mockNotificationId: 1)

        assertInAppNotificationShown()
    }

    func testNotificationShownOnlyOnce() {
        app.launchWithArgs(mockNotificationId: 1)

        assertInAppNotificationShown()

        closeInAppNotification()
        app.launchWithArgs(resetDefaults: false, mockNotificationId: 1)

        assertInAppNotificationNotShown()
    }

    func testNotificationShownAgainIfNotClosed() {
        app.launchWithArgs(mockNotificationId: 1)

        assertInAppNotificationShown()

        app.launchWithArgs(resetDefaults: false, mockNotificationId: 1)

        assertInAppNotificationShown()
    }

    func testNotificationWithDifferentIdShown() {
        app.launchWithArgs(mockNotificationId: 1)

        assertInAppNotificationShown()

        closeInAppNotification()
        app.launchWithArgs(resetDefaults: false, mockNotificationId: 2)

        assertInAppNotificationShown()
    }

    func testSeenLastNotificationMigrated() {
        app.launchWithArgs(mockNotificationId: 1, extraDefaults: [
            "lastUpdateNotificationId": "1",
            "lastUpdateNotificationState": "ALL_SEEN"
        ])
        assertInAppNotificationNotShown()
    }

    func testPartlySeenLastNotificationMigrated() {
        app.launchWithArgs(mockNotificationId: 1, extraDefaults: [
            "lastUpdateNotificationId": "1",
            "lastUpdateNotificationState": "PUSH_SEEN"
        ])
        assertInAppNotificationShown()
    }

    func testUnseenLastNotificationMigrated() {
        app.launchWithArgs(mockNotificationId: 1, extraDefaults: [
            "lastUpdateNotificationId": "1",
            "lastUpdateNotificationState": "NOT_SEEN"
        ])
        assertInAppNotificationShown()
    }

    // TODO: Add tests that verify that the push notification shows up.

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

    private func closeInAppNotification() {
        findInAppNotificationCloseButton().tap()
        sleep(1)
    }
}
