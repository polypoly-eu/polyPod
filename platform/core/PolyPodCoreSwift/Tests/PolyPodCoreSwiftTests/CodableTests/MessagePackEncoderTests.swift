//
//  MessagePackEncoderTests.swift
//  
//
//  Created by Palade Timotei on 14.08.22.
//

import XCTest
import MessagePack

@testable import PolyPodCoreSwift

class MessagePackEncoderTests: XCTestCase {
    func testNil() throws {
        let value: String? = nil
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.nil)
    }
    
    func testString() throws {
        let value: String = ""
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.string(""))
    }
    
    func testOptionalString() throws {
        let value: String? = ""
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.string(""))
    }
}
