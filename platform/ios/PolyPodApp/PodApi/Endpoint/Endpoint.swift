import Foundation
import MessagePack

protocol EndpointProtocol {
    func send(endpointId: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (String?) -> Void) -> Void
    func get(endpointId: String, contentType: String?, authorization: String?, completionHandler: @escaping (String?, String?) -> Void) -> Void
}

protocol EndpointDelegate {
    func doHandleApproveEndpointFetch(endpointId: String, completion: @escaping (Bool) -> Void) -> Void
}

protocol EndpointInfoProtocol: Decodable {
    var url: String { get }
    var auth: String { get }
}

struct EndpointInfo: EndpointInfoProtocol {
    let url: String
    let auth: String
}

private func endpointErrorMessage(apiCall: String) -> String {
    return "endpoint.\(apiCall) failed"
}

class Endpoint: EndpointProtocol {
    
    init() {
        delegate = nil
    }
    
    var delegate: EndpointDelegate?
    
    func approveEndpointFetch(endpointId: String, completion: @escaping (Bool) -> Void) -> Void {
        delegate?.doHandleApproveEndpointFetch(endpointId: endpointId, completion: completion)
    }
    
    private func endpointInfoFromId(endpointId: String) -> EndpointInfo? {
        let endpointsPath = Bundle.main.bundleURL
            .appendingPathComponent("config/endpoints.json")
        guard let endpointsJsonData = (try? Data(contentsOf: endpointsPath)) else { return nil }
        guard let endpointsJson = (try? JSONDecoder().decode(Dictionary<String,EndpointInfo>.self, from: endpointsJsonData)) else { return nil }
        return endpointsJson[endpointId]
    }
    
    let network: Network = Network()
    func send(endpointId: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (String?) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler( endpointErrorMessage(apiCall: "send"))
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler(endpointErrorMessage(apiCall: "send"))
                return
            }
            let response = self.network.httpPost(url: endpointInfo.url, body: payload, contentType: contentType, authorization: endpointInfo.auth)
            if (response.error == nil) {
                completionHandler(nil)
            } else {
                completionHandler(endpointErrorMessage(apiCall: "send"))
            }
        }
    }
    
    func get(endpointId: String, contentType: String?, authorization: String?, completionHandler: @escaping (String?, String?) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler(nil, endpointErrorMessage(apiCall: "get"))
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler(nil, endpointErrorMessage(apiCall: "get"))
                return
            }
            let response = self.network.httpGet(url: endpointInfo.url, contentType: contentType, authorization: endpointInfo.auth)
            if (response.error == nil && response.data != nil) {
                completionHandler(response.data, nil)
            } else {
                completionHandler(nil, endpointErrorMessage(apiCall: "get"))
            }
        }
    }
}
