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
    
    func testBool() throws {
        let value: Bool = false
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.bool(false))
    }
    
    func testOptionalBool() throws {
        let value: Bool? = false
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.bool(false))
    }
    
    func testString() throws {
        let value: String = ""
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.string(""))
    }
    
    func testOptionalString() throws {
        let value: String? = ""
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.string(""))
    }
    
    func testDouble() throws {
        let value: Double = 1.0
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.double(1.0))
    }
    
    func testOptionalDouble() throws {
        let value: Double? = 1.0
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.double(1.0))
    }

    func testFloat() throws {
        let value: Float = 1.0
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.float(1.0))
    }
    
    func testOptionalFloat() throws {
        let value: Float? = 1.0
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.float(1.0))
    }
    
    func testInt() throws {
        let value: Int = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testOptionalInt() throws {
        let value: Int? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testInt8() throws {
        let value: Int8 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testOptionalInt8() throws {
        let value: Int8? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testInt16() throws {
        let value: Int16 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testOptionalInt16() throws {
        let value: Int16? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testInt32() throws {
        let value: Int32 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testOptionalInt32() throws {
        let value: Int32? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testInt64() throws {
        let value: Int64 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testOptionalInt64() throws {
        let value: Int64? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.int(1))
    }
    
    func testUInt() throws {
        let value: UInt = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testOptionalUInt() throws {
        let value: UInt? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testUInt8() throws {
        let value: UInt8 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testOptionalUInt8() throws {
        let value: UInt8? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testUInt16() throws {
        let value: UInt16 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testOptionalUInt16() throws {
        let value: UInt16? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testUInt32() throws {
        let value: UInt32 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testOptionalUInt32() throws {
        let value: UInt32? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testUInt64() throws {
        let value: UInt64 = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testOptionalUInt64() throws {
        let value: UInt64? = 1
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.uint(1))
    }
    
    func testData() throws {
        let value: Data = Data([1, 2, 3])
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.binary(Data([1, 2, 3])))
    }
    
    func testOptionalData() throws {
        let value: Data? = Data([1, 2, 3])
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.binary(Data([1, 2, 3])))
    }
    
    func testArray() throws {
        let value: [Int] = [1, 2, 3]
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.array([.int(1), .int(2), .int(3)]))
    }
    
    func testOptionalArray() throws {
        let value: [Int]? = [1, 2, 3]
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.array([.int(1), .int(2), .int(3)]))
    }
    
    func testArrayWithNils() throws {
        let value: [Int?] = [1, nil, nil]
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.array([.int(1), .nil, .nil]))
    }
    
    func testSet() throws {
        let value: Set<Int> = Set([1, 2, 3])
        let result = try MessagePackEncoder().encode(value).getArray()
        XCTAssertEqual(Set(result), Set([.int(1), .int(2), .int(3)]))
    }
    
    func testOptionalSet() throws {
        let value: Set<Int>? = Set([1, 2, 3])
        let result = try MessagePackEncoder().encode(value).getArray()
        XCTAssertEqual(Set(result), Set([.int(1), .int(2), .int(3)]))
    }
    
    func testSetWithNils() throws {
        let value: Set<Int?> = Set([1, nil, nil])
        let result = try MessagePackEncoder().encode(value).getArray()
        XCTAssertEqual(Set(result), Set([.int(1), .nil, .nil]))
    }
    
    func testDictionary() throws {
        let value: Dictionary<String, Int> = ["1": 1, "2": 2, "3": 3]
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.map(["1": .int(1), "2": .int(2), "3": .int(3)]))
    }
    
    func testOptionalDictionary() throws {
        let value: Dictionary<String, Int>? = ["1": 1, "2": 2, "3": 3]
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.map(["1": .int(1), "2": .int(2), "3": .int(3)]))
    }
    
    func testDictionaryWithNils() throws {
        let value: Dictionary<String, Int?> = ["1": 1, "2": nil, "3": nil]
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.map(["1": .int(1), "2": .nil, "3": .nil]))
    }
}
