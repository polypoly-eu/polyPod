import Foundation

struct PolyEndpointRequest {
    let endpointId: String
    let featureIdToken: String
    let payload: String
    let contentType: String?
    let authorization: String?
}

protocol PolyEndpointProtocol {
    func send(polyEndpointRequest: PolyEndpointRequest)
    func get(polyEndpointRequest: PolyEndpointRequest)
}


class PolyEndpoint: PolyEndpointProtocol {
    let network: Network = Network()
    func send(polyEndpointRequest: PolyEndpointRequest) {
        let url: String = "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
        let response = network.httpPost(url: url, body: polyEndpointRequest.payload, contentType: polyEndpointRequest.contentType, authorization: polyEndpointRequest.authorization)
        print(error)
    }
    
    func get(polyEndpointRequest: PolyEndpointRequest) {
    }
}
