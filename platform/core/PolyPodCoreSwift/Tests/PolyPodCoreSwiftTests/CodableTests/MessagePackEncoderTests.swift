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
    
    func testDate() throws {
        let value: Date = Date()
        let string = ISO8601DateFormatter().string(from: value)
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.string(string))
    }
    
    func testOptionalDate() throws {
        let value: Date? = Date()
        let string = ISO8601DateFormatter().string(from: value!)
        XCTAssertEqual(try MessagePackEncoder().encode(value), MessagePackValue.string(string))
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
    
    enum TestEnum: Codable {
        case simple
        case namedArguments(s: String, i: Int, bin: Data, date: Date)
        case indexedArguments(String, Int, Data, Date)
        case optionalArguments(s: String?, i: Int?, bin: Data?, date: Date?)
    }
    
    enum Example: Codable {
        case sample
    }
    
    func testEnumSimple() throws {
        let value = TestEnum.simple
        XCTAssertEqual(try MessagePackEncoder().encode(value), .string("simple"))
    }
    
    func testOptionalEnumSimple() throws {
        let value: TestEnum? = TestEnum.simple
        XCTAssertEqual(try MessagePackEncoder().encode(value), .map([.string("simple"): .map([:])]))
    }
    
    func testEnumNamedArguments() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestEnum = TestEnum.namedArguments(s: "", i: 1, bin: Data([1, 2, 3]), date: date)
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([.string("namedArguments"):
                    .map([
                        .string("date"): .string(date_string),
                        .string("i"): .int(1),
                        .string("bin"): .binary(Data([1, 2, 3])),
                        .string("s"): .string("")
                    ])
            ])
        )
    }
    
    func testOptionalEnumNamedArguments() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestEnum? = TestEnum.namedArguments(s: "", i: 1, bin: Data([1, 2, 3]), date: date)
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([.string("namedArguments"):
                    .map([
                        .string("date"): .string(date_string),
                        .string("i"): .int(1),
                        .string("bin"): .binary(Data([1, 2, 3])),
                        .string("s"): .string("")
                    ])
            ])
        )
    }
    
    func testEnumIndexedArguments() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestEnum = TestEnum.indexedArguments("", 1, Data([1, 2, 3]), date)
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([.string("indexedArguments"):
                    .map([
                        .string("_3"): .string(date_string),
                        .string("_1"): .int(1),
                        .string("_2"): .binary(Data([1, 2, 3])),
                        .string("_0"): .string("")
                    ])
            ])
        )
    }
    
    func testOptionalEnumIndexedArguments() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestEnum? = TestEnum.indexedArguments("", 1, Data([1, 2, 3]), date)
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([.string("indexedArguments"):
                    .map([
                        .string("_3"): .string(date_string),
                        .string("_1"): .int(1),
                        .string("_2"): .binary(Data([1, 2, 3])),
                        .string("_0"): .string("")
                    ])
            ])
        )
    }
    
    func testEnumOptionalArguments() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestEnum = TestEnum.optionalArguments(s: "", i: nil, bin: nil, date: date)
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([.string("optionalArguments"):
                    .map([
                        .string("date"): .string(date_string),
                        .string("s"): .string("")
                    ])
            ])
        )
    }
    
    func testOptionalEnumOptionalArguments() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestEnum? = TestEnum.optionalArguments(s: "", i: nil, bin: nil, date: date)
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([.string("optionalArguments"):
                    .map([
                        .string("date"): .string(date_string),
                        .string("s"): .string("")
                    ])
            ])
        )
    }
    
    struct TestStruct: Codable {
        let date: Date
        let data: Data
        let string: String
        let bool: Bool
        let int: Int
        let uInt: UInt
        let double: Double
        let float: Float
        let array: Array<Int>
        let map: Dictionary<String, Int>
    }
    
    func testStruct() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestStruct = TestStruct(date: date,
                                           data: Data([1, 2, 3]),
                                           string: "",
                                           bool: false,
                                           int: 1,
                                           uInt: 1,
                                           double: 1.0,
                                           float: 1.0,
                                           array: [1, 2],
                                           map: ["test": 1])
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([
                .string("float"): .float(1.0),
                .string("data"): .binary(Data([1, 2, 3])),
                .string("int"): .int(1),
                .string("bool"): .bool(false),
                .string("uInt"): .uint(1),
                .string("map"): .map([
                    .string("test"): .int(1)
                ]),
                .string("array"): .array([.int(1), .int(2)]),
                .string("string"): .string(""),
                .string("date"): .string(date_string),
                .string("double"): .double(1.0)
            ])
        )
    }
    
    func testOptionalStruct() throws {
        let date = Date()
        let date_string = ISO8601DateFormatter().string(from: date)
        let value: TestStruct? = TestStruct(date: date,
                                           data: Data([1, 2, 3]),
                                           string: "",
                                           bool: false,
                                           int: 1,
                                           uInt: 1,
                                           double: 1.0,
                                           float: 1.0,
                                           array: [1, 2],
                                           map: ["test": 1])
        XCTAssertEqual(try MessagePackEncoder().encode(value),
            .map([
                .string("float"): .float(1.0),
                .string("data"): .binary(Data([1, 2, 3])),
                .string("int"): .int(1),
                .string("bool"): .bool(false),
                .string("uInt"): .uint(1),
                .string("map"): .map([
                    .string("test"): .int(1)
                ]),
                .string("array"): .array([.int(1), .int(2)]),
                .string("string"): .string(""),
                .string("date"): .string(date_string),
                .string("double"): .double(1.0)
            ])
        )
    }
}
