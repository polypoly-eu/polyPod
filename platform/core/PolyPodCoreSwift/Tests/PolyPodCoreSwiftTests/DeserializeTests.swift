//
//  DeserializeTests.swift
//  
//
//  Created by Palade Timotei on 12.08.22.
//

import XCTest
import MessagePack

@testable import PolyPodCoreSwift

class DeserializeTests: XCTestCase {
    func testDeserializeNil() throws {
        XCTAssertNil(try deserialize(value: .nil, Any.self, Error.self))
    }
    
    func testDeserializeOptionalString() throws {
        let value: String? = try deserialize(value: .string(""))
        XCTAssertEqual(value, "")
    }
    
    func testDeserializeOptionalInt() throws {
        let value: Int64? = try deserialize(value: .int(Int64(0)))
        XCTAssertEqual(value, Int64(0))
    }
    
    func testDeserializeOptionalUInt() throws {
        let value: UInt64? = try deserialize(value: .uint(UInt64(0)))
        XCTAssertEqual(value, UInt64(0))
    }
    
    func testDeserializeOptionalFloat() throws {
        let value: Float? = try deserialize(value: .float(0.0))
        XCTAssertEqual(value, 0.0)
    }
    
    func testDeserializeOptionalDouble() throws {
        let value: Double? = try deserialize(value: .double(0.0))
        XCTAssertEqual(value, 0.0)
    }
    
    func testDeserializeOptionalBool() throws {
        let value: Bool? = try deserialize(value: .bool(false))
        XCTAssertEqual(value, false)
    }
    
    func testDeserializeOptionalData() throws {
        let value: Data? = try deserialize(value: .binary(Data([1, 2, 3])))
        XCTAssertEqual(value, Data([1, 2, 3]))
        
        let value2: Data? = try deserialize(value: .extended(Int8(0), Data([1, 2, 3])))
        XCTAssertEqual(value2, Data([1, 2, 3]))
    }
    
    func testDeserializeString() throws {
        let value: String = try deserialize(value: .string(""))
        XCTAssertEqual(value, "")
    }
    
    func testDeserializeInt() throws {
        let value: Int64 = try deserialize(value: .int(Int64(0)))
        XCTAssertEqual(value, Int64(0))
    }
    
    func testDeserializeUInt() throws {
        let value: UInt64 = try deserialize(value: .uint(UInt64(0)))
        XCTAssertEqual(value, UInt64(0))
    }
    
    func testDeserializeFloat() throws {
        let value: Float = try deserialize(value: .float(0.0))
        XCTAssertEqual(value, 0.0)
    }
    
    func testDeserializeDouble() throws {
        let value: Double = try deserialize(value: .double(0.0))
        XCTAssertEqual(value, 0.0)
    }
    
    func testDeserializeBool() throws {
        let value: Bool = try deserialize(value: .bool(false))
        XCTAssertEqual(value, false)
    }
    
    func testDeserializeData() throws {
        let value: Data = try deserialize(value: .binary(Data([1, 2, 3])))
        XCTAssertEqual(value, Data([1, 2, 3]))
        
        let value2: Data = try deserialize(value: .extended(Int8(0), Data([1, 2, 3])))
        XCTAssertEqual(value2, Data([1, 2, 3]))
    }
    
    func testSimpleDeserializeArrayFails() throws {
        XCTAssertThrowsError(try deserialize(value: .array([.string("1"), .string("2")])) as Array<String>)
    }
    
    func testSimpleDeserializeMapFails() throws {
        XCTAssertThrowsError(try deserialize(value: .map([.string("1"): .string("2")])) as Dictionary<AnyHashable, Any>)
    }
    
    //TODO: Deserialize Array And Dictionary
    //TODO: Deserialize CoreResponse and CoreFailure
    
    func testDeserializeResult() throws {
        let arg: MessagePackValue = .map(["Ok": .string("Test")])
        let out: Result<String?, CoreFailure> = try deserialize(value: arg, String?.self, CoreFailure.self)
        XCTAssertEqual(out, .success("Test"))
    }
}
