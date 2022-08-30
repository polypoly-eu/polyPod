// Please remove this line and the empty one after it

import XCTest

class FeatureSmokeTest: XCTestCase {
    private let app = XCUIApplication()
    
    override func setUpWithError() throws {
        try super.setUpWithError()
        continueAfterFailure = false
    }

    func testOpenFeaturesNoErrorPopUp() throws {
        app.launchWithArgs()
        assertHomeScreenIsShown()
        
        let identifier = "feature_tile_view"
        var count = 0
        
        while true {
            let tile = featureTileView(index: count, identifier: identifier)
            count += 1
            
            if tile.exists {
                print("\(identifier) - \(count)")
                openFeatureAndCheckForErrorPopup(tile: tile)
            } else {
                break
            }
        }
        
    }

    private func assertHomeScreenIsShown() {
        XCTAssertTrue(
            homeScreenView().exists,
            "Homescreen was supposed to be shown"
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

    private func featureTileView(index: Int, identifier: String) -> XCUIElement {
        app.otherElements.matching(identifier: identifier).element(boundBy: index)
    }
    
    private func openFeatureAndCheckForErrorPopup(tile: XCUIElement) {
        var featureViewVisible = false
        var swipeDownCount = 0
        
        while !featureViewVisible && swipeDownCount < 20 {
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
        guard closeButton.waitForExistence(timeout: 10) else {
            XCTAssert(false, "Close button not found after tapping the feature.")
            return
        }
        closeButton.tap()
        
        guard homeScreenView().waitForExistence(timeout: 10) else {
            XCTAssert(false, "Home screen not found after tapping the close button.")
            return
        }
        // Reset
        for _ in 0..<swipeDownCount {
            homeScreenView().swipeDown()
        }
    }
}
