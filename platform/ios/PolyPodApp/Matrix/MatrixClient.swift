// Please remove this line and the empty one after it

import Foundation
import MatrixSDK

class MatrixClient {
    let homeServerUrl = URL(string: "http://matrix.org")!
    lazy var client = MXRestClient(homeServer: homeServerUrl,
                              unrecognizedCertificateHandler: nil)
    
    func listPublicRooms() {
        // Tested the connection
        client.publicRooms(onServer: nil, limit: nil) { response in
            switch response {
                case .success(let rooms):
                    // rooms is an array of MXPublicRoom objects containing information like room id
                    print("The public rooms are: \(rooms)")

                case .failure:
                    print("Failed")

                break
                }
        }
    }
}
