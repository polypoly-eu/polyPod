import XCTest

class OnboardingTest: XCTestCase {
    private let app = XCUIApplication()
    
    override func setUp() {
        super.setUp()
        continueAfterFailure = false
    }
    
    func testOnboardingShowsUpOnFirstRun() {
        app.launchWithArgs(firstRun: true)
        assertOnboardingIsShown()
    }
    
    func testOnboardingNotShownOnSubsequentRun() {
        app.launchWithArgs()
        assertOnboardingIsNotShown()
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
