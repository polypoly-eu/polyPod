import XCTest

class FeatureTest: XCTestCase {
    private let timeout: TimeInterval = 10
    private let app = XCUIApplication()

    override func setUp() {
        super.setUp()
        continueAfterFailure = false
    }

    func testRunAllTestFeatureTests() {
        app.launchWithArgs(showDeveloperFeatures: true)
        app.otherElements["test_feature"].tap()
        let runAllButton = app.webViews.buttons["runAll"]
        XCTAssertTrue(runAllButton.waitForExistence(timeout: timeout))
        runAllButton.tap()
        XCTAssertTrue(
            app.webViews.staticTexts["All OK"]
                .waitForExistence(timeout: timeout)
        )
    }
}
