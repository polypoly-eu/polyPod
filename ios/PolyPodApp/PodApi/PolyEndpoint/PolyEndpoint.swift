import Foundation

struct EndpointRequest {
    let endpointId: String
    let featureIdToken: String
    let payload: String
    let contentType: String?
    let authorization: String?
}

protocol EndpointProtocol {
    func send(endpointRequest: EndpointRequest)
    func get(endpointRequest: EndpointRequest)
}


class Endpoint: EndpointProtocol {
    let network: Network = Network()
    func send(endpointRequest: EndpointRequest) {
        let url: String = "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
        let response = network.httpPost(url: url, body: endpointRequest.payload, contentType: endpointRequest.contentType, authorization: endpointRequest.authorization)
    }
    
    func get(endpointRequest: EndpointRequest) {
        let url: String = "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
        let response = network.httpGet(url: url, body: endpointRequest.payload, contentType: endpointRequest.contentType, authorization: endpointRequest.authorization)
        print(response)
    }
}
