import SwiftUI
import XCTest

class ColorExtensionsTest: XCTestCase {
    private let red = Color(red: 1.0, green: 0, blue: 0)
    private let transparentRed = Color(red: 1.0, green: 0, blue: 0, opacity: 0)
    
    func testNamedColorEquality() {
        // This is not testing _our_ code, but the standard Color class.
        // We are staying away from named colours in the code, because they
        // end up not being equivalent to the same colour constructred from
        // RGB values. Should this behaviour ever change in Swift, we will
        // want to update our code accordingly. So if this test ever fails,
        // it's time to refactor and remove some warning comments.
        XCTAssertNotEqual(red, Color.red)
        XCTAssertNotEqual(transparentRed, Color.red.opacity(0))
    }
    
    func testFromHexUpperAndLowerCase() {
        XCTAssertEqual(red, Color(fromHex: "#FF0000"))
        XCTAssertEqual(red, Color(fromHex: "#ff0000"))
        XCTAssertEqual(red, Color(fromHex: "#Ff0000"))
    }
    
    func testFromHexWithFourBytes() {
        XCTAssertEqual(red, Color(fromHex: "#FF0000FF"))
        XCTAssertEqual(transparentRed, Color(fromHex: "#FF000000"))
    }

    func testFromHexWithInvalidString() {
        XCTAssertEqual(Color.clear, Color(fromHex: ""))
        XCTAssertEqual(Color.clear, Color(fromHex: "#x"))
    }

    func testFromHexOptimisticParsing() {
        // This isn't necessarily desired behaviour, but at the moment
        // the parser is implemented in such a way that it manages to deal
        // with some invalid inputs, still _sort of_ doing the right thing.
        XCTAssertEqual(red, Color(fromHex: "ff0000"))
        XCTAssertEqual(red, Color(fromHex: "x#ff0000"))
        XCTAssertEqual(red, Color(fromHex: "00ff00#ff0000"))
    }
}
