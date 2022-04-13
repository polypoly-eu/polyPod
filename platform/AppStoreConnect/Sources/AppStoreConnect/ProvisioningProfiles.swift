import Foundation
import AppStoreConnect_Swift_SDK

extension AppStoreConnect {
    
    /// Retrieves the provisioning profile content for a given name
    /// - Parameter name: The name of the provisioning profile to get the content for
    /// - Returns: The content of the provisioning profile
    public func getProfileContent(forProvisioningProfile name: String) async throws -> String {
        let profile = try await getProvisioningProfile(withName: name)
        guard let encodedContent = profile.attributes?.profileContent else {
            throw AppStoreConnectError.provisioningProfileContentIsMissing
        }
        
        return encodedContent
    }
    
    func getProvisioningProfile(withName name: String) async throws -> Profile {
        NSLog("Retrieving provisioning profile with name \(name)")
        let endpoint = APIEndpoint.listProfiles(filter: [.name([name])])
        let result = try await apiProvider.request(endpoint)
        if let profile = result.data.first {
            NSLog("Succesfully downloaded provisioning profile with name \(name)")
            return profile
        }
        NSLog("Failed to download provisioning profile with name \(name)")
        throw AppStoreConnectError.provisioningProfileNotFound
    }
}
