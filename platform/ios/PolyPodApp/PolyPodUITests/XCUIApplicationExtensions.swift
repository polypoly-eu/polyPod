import XCTest

extension XCUIApplication {
    func launchWithArgs(
        resetDefaults: Bool = true,
        firstRun: Bool = false,
        mockNotificationId: Int? = 0,
        showDeveloperFeatures: Bool? = false
    ) {
        typealias Keys = UserDefaults.Keys
        launchArguments = [
            "-\(Keys.firstRun.rawValue)",
            "\(firstRun)"
        ]
        if resetDefaults {
            launchArguments += [
                "-\(Keys.resetUserDefaults.rawValue)",
                "true"
            ]
        }
        if let mockNotificationId = mockNotificationId {
            launchArguments += [
                "-\(Keys.updateNotificationMockId.rawValue)",
                "\(mockNotificationId)"
            ]
        }
        if let showDeveloperFeatures = showDeveloperFeatures {
            launchArguments += [
                "-\(Keys.showDeveloperFeaturesId.rawValue)",
                "\(showDeveloperFeatures)"
            ]
        }
        launch()
        let background = wait(for: .runningForeground, timeout: 120)
        XCTAssertTrue(background)
    }
}
