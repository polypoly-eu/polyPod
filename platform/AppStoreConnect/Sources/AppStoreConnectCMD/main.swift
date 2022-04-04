import Foundation
import AppStoreConnect
import AppStoreConnect_Swift_SDK
import ArgumentParser

// MARK: - Read environment variables

enum EnvironmentError: Error {
    case missing_APPSTORE_API_ISSUER_ID
    case missing_APPSTORE_API_KEY_ID
    case missing_APP_STORE_CONNECT_API_KEY
}

let processInfo = ProcessInfo.processInfo
guard let issuerID = processInfo.environment["POLYPOD_APPLE_IOS_APPSTORE_API_ISSUER_ID"] else {
    throw EnvironmentError.missing_APPSTORE_API_ISSUER_ID
}

guard let privateKeyID = processInfo.environment["POLYPOD_APPLE_IOS_APPSTORE_API_KEY_ID"] else {
    throw EnvironmentError.missing_APPSTORE_API_KEY_ID
}
guard let privateKey = processInfo.environment["POLYPOD_APPLE_IOS_APPSTORE_API_PRIVATE_KEY_BASE64"] else {
    throw EnvironmentError.missing_APP_STORE_CONNECT_API_KEY
}

let decodedPrivateKey = try AppStoreConnect.decodeBase64Key(privateKey)

// MARK: - Configure AppStoreConnect
let configuration = APIConfiguration(issuerID: issuerID,
                                     privateKeyID: privateKeyID,
                                     privateKey: decodedPrivateKey)
let appStoreConnect = AppStoreConnect(configuration: configuration)

// MARK: - Execute command
AppStoreConnectCMD.main()
