import SwiftUI
import XCTest

class UIColorExtensionsTest: XCTestCase {
    func testCompatInitEquality() {
        let swiftUiColor = Color(red: 1, green: 0, blue: 0)
        let uiColor = UIColor.compatInit(swiftUiColor)
        let components = uiColor.cgColor.components
        XCTAssertNotNil(components)
        // Having to specify accuracy here is a wee bit fishy, might be a bug.
        XCTAssertEqual(1, components![0], accuracy: 0.0000001)
        XCTAssertEqual(0, components![1])
        XCTAssertEqual(0, components![2])
        XCTAssertEqual(1, components![3])
    }
}
