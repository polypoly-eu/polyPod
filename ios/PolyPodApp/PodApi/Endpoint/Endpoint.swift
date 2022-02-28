import Foundation

protocol EndpointProtocol {
    func send(endpointId: String, featureIdToken: String, payload: String, contentType: String?, authorization: String?)
    func get(endpointId: String, featureIdToken: String, contentType: String?, authorization: String?)
}


class Endpoint: EndpointProtocol {
    let network: Network = Network()
    func send(endpointId: String, featureIdToken: String, payload: String, contentType: String?, authorization: String?) {
        print("send")
        let url: String = "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
        let response = network.httpPost(url: url, body: payload, contentType: contentType, authorization: authorization)
    }
    
    func get(endpointId: String, featureIdToken: String, contentType: String?, authorization: String?) {
        print("get")
        let url: String = "https://e27a0801-f759-48dc-97fc-d78d1fb65a90.mock.pstmn.io/127.0.0.2:5000"
        let response = network.httpGet(url: url, contentType: contentType, authorization: authorization)
        print(response)
    }
}
