import SwiftUI
import XCTest

class ColorExtensionsTest: XCTestCase {
    private let red = Color(red: 1.0, green: 0, blue: 0)
    
    func testNamedColorEquality() {
        // This is not testing _our_ code, but the standard Color class.
        // We are staying away from named colours in the code, because they
        // end up not being equivalent to the same colour constructred from
        // RGB values. Should this behaviour ever change in Swift, we will
        // want to update our code accordingly. So if this test ever fails,
        // it's time to refactor and remove some warning comments.
        XCTAssertNotEqual(red, Color.red)
        XCTAssertNotEqual(
            Color(red: 1, green: 0, blue: 0, opacity: 0),
            Color.red.opacity(0)
        )
    }
    
    func testFromHexUpperAndLowerCase() {
        XCTAssertEqual(red, Color(fromHex: "#FF0000"))
        XCTAssertEqual(red, Color(fromHex: "#ff0000"))
        XCTAssertEqual(red, Color(fromHex: "#Ff0000"))
    }
    
    func testFromHexWithFourBytes() {
        XCTAssertEqual(red, Color(fromHex: "#FF0000FF"))
        XCTAssertEqual(
            Color(red: 1, green: 0, blue: 0, opacity: 0),
            Color(fromHex: "#FF000000")
        )
    }
}
