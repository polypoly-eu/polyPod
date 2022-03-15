import XCTest

class UpdateNotificationTest: XCTestCase {
    override func setUp() {
        UserDefaults.standard.removeObject(
            forKey: UserDefaults.Keys.lastUpdateNotificationId.rawValue
        )
    }
    
    func testFailure() {
        XCTAssert(false, "Expected failure")
    }
    
    func testNotificationWithId0Seen() {
        let notification = loadNotification(0)
        XCTAssertFalse(notification.showInApp)
        XCTAssertFalse(notification.showPush)
    }
    
    func testFirstNotificationNotSeen() {
        let notification = loadNotification(1)
        XCTAssertTrue(notification.showInApp)
        XCTAssertTrue(notification.showPush)
    }
    
    func testPreviouslySeenNotificationSeen() {
        let notification = loadNotification(1)
        notification.handleInAppSeen()
        XCTAssertFalse(notification.showInApp)
        XCTAssertFalse(notification.showPush)
    }
    
    func testAdditionalNotificationNotSeen() {
        let notification = loadNotification(1)
        notification.handleInAppSeen()
        
        let secondNotification = loadNotification(2)
        XCTAssertTrue(secondNotification.showInApp)
        XCTAssertTrue(secondNotification.showPush)
    }
    
    func testAdditionalNotificationWithLowerIdSeen() {
        let notification = loadNotification(2)
        notification.handleInAppSeen()
        
        let secondNotification = loadNotification(1)
        XCTAssertFalse(secondNotification.showInApp)
        XCTAssertFalse(secondNotification.showPush)
    }
    
    func testPushNotificationSeenAfterStartup() {
        let notification = loadNotification(1)
        notification.handleStartup()
        XCTAssertFalse(notification.showPush)
    }
    
    func testInAppNotSeenAfterPushSeen() {
        let notification = loadNotification(1)
        notification.handlePushSeen()
        XCTAssertTrue(notification.showInApp)
        XCTAssertFalse(notification.showPush)
    }
    
    func testAllSeenAfterFirstRun() {
        let notification = loadNotification(1)
        notification.handleFirstRun()
        XCTAssertFalse(notification.showInApp)
        XCTAssertFalse(notification.showPush)
    }
    
    private func loadNotification(_ id: Int) -> UpdateNotification {
        UserDefaults.standard.set(
            id,
            forKey: UserDefaults.Keys.updateNotificationMockId.rawValue
        )
        return UpdateNotification()
    }
}
