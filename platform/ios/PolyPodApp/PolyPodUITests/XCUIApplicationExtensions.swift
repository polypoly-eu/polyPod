import XCTest

extension XCUIApplication {
    func launchWithArgs(
        resetDefaults: Bool = true,
        firstRun: Bool = false,
        mockNotificationId: Int? = 0,
        showDeveloperFeatures: Bool? = false,
        extraDefaults: [String: String] = [:]
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

        for (key, value) in extraDefaults {
            launchArguments += ["-\(key)", value]
        }

        // This makes sure an already running app is first made inactive.
        // Apparently, we don't trigger any inactive/termination events by
        // calling XCUIApplication.launch (as opposed to production).
        // If we were to save core preferences on write, not on
        // inactive/terminate, we shouldn't need this.
        XCUIDevice.shared.press(.home)
        sleep(1)

        launch()
        let background = wait(for: .runningForeground, timeout: 120)
        XCTAssertTrue(background)
    }
}
