import Foundation
import XCTest
@testable import AppStoreConnect

class Base64p8KeyParsingTests: XCTestCase {
    func test_properlyExtractsTheKey() throws {
        // The actual key
        let key = """
        MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgf0pWHQ6LWiAOcnX2
        x2YyuQTJtuFVy6i9yTMBoy1YLaGgCgYIKoZIzj0DAQehRANCAAS4FVP1vdwb1YQE
        sDhUyYJ+yfpjMIYmdQmSgFE6mrhkY5H1rdg5TF/g/G4BYVkY5+juMwnu113nQLzF
        EFHc2y58
        """
        
        // The key as it is defined in the .p8 file
        let p8KeyDefinition = """
        -----BEGIN PRIVATE KEY-----
        \(key)
        -----END PRIVATE KEY-----
        """
        
        // Expected key to be extracted after parsing the base64 format key.
        // It should not contain newlines, as pe AppStoreConnect-Swift-SDK specifications
        let expectedKey = key.components(separatedBy: .newlines).joined()
        
        let decodedKey = try AppStoreConnect.cleanupPrivateKey(p8KeyDefinition)
        
        XCTAssertEqual(expectedKey, decodedKey)
    }
}
