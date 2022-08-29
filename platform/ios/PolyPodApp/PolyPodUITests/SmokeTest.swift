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
    
    private func featureErrorPopup() -> XCUIElement {
        app.alerts["feature_error_popup"]
    }

    private func featureTitleText() -> XCUIElement {
        app.otherElements["feature_title_text"]
    }

    private func featureTileView(index: Int, indentifier: String) -> XCUIElement {
        app.otherElements.matching(identifier: indentifier).element(boundBy: index)
    }
    
    private func openFeatureAndCheckForErrorPopup(tile: XCUIElement) {
        var featureViewVisible = false
        var swipeDownCount = 0
        
        while !featureViewVisible {
            tile.tap()
            featureViewVisible = featureView().waitForExistence(timeout: 1)
            if !featureViewVisible {
                // Need to swipe up so that the tile becomes visible and the tap succeeds
                homeScreenView().swipeUp()
                swipeDownCount += 1
            }
        }
        
        let featureTitle = featureTitleText().staticTexts.firstMatch.label
        let errorPopUpVisible = featureErrorPopup().waitForExistence(timeout: 5)
        XCTAssertFalse(errorPopUpVisible, "Error popup shown after opening feature: \(featureTitle)")
        
        let closeButton = featureCloseButton()
        _ = closeButton.waitForExistence(timeout: 1)
        closeButton.tap()
        _ = homeScreenView().waitForExistence(timeout: 1)
        
        // Reset
        for _ in 0..<swipeDownCount {
            homeScreenView().swipeDown()
        }
    }
}
