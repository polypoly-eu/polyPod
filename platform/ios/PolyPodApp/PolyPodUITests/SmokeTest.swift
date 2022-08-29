// Please remove this line and the empty one after it

import XCTest

class SmokeTest: XCTestCase {
    private let app = XCUIApplication()
    
    override func setUpWithError() throws {
        try super.setUpWithError()
        continueAfterFailure = false
    }

    func testOpenFeaturesNoErrorPopUp() throws {
        app.launchWithArgs()
        assertHomeScreenIsShown()
        
        let tile_identifiers = ["big_card_view", "medium_card_view", "small_card_view"]
        
        for identifier in tile_identifiers {
            var count = 0
            var exists = true
            while exists {
                let tile = featureTileView(index: count, indentifier: identifier)
                exists = tile.exists
                count += 1
                if exists {
                    print("\(identifier) - \(count)")
                    openFeatureAndCheckForErrorPopup(tile: tile)
                }
            }
        }
    }

    private func assertHomeScreenIsShown() {
        XCTAssertTrue(
            homeScreenView().exists,
            "Onboarding was supposed to be shown"
        )
    }

    private func homeScreenView() -> XCUIElement {
        app.otherElements["homescreen_view"]
    }
    
    private func featureView() -> XCUIElement {
        app.otherElements["feature_view"]
    }

    private func featureCloseButton() -> XCUIElement {
        app.otherElements["feature_close_button"]
    }

    private func featureTileView(index: Int, indentifier: String) -> XCUIElement {
        app.otherElements.matching(identifier: indentifier).element(boundBy: index)
    }
    
    private func openFeatureAndCheckForErrorPopup(tile: XCUIElement) {
        tile.tap()
        _ = featureView().waitForExistence(timeout: 2)
        // TODO: check for existence of error popup
        sleep(1)
        let closeButton = featureCloseButton()
        _ = closeButton.waitForExistence(timeout: 2)
        closeButton.tap()
        _ = homeScreenView().waitForExistence(timeout: 2)
    }
}
