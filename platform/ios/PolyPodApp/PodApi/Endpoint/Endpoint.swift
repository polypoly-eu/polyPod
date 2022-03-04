import Foundation

protocol EndpointProtocol {
    func send(endpointId: String, featureIdToken: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (String) -> Void) -> Void
    func get(endpointId: String, featureIdToken: String, contentType: String?, authorization: String?, completionHandler: @escaping (String) -> Void) -> Void
}

protocol EndpointDelegate {
    func doHandleApproveEndpointFetch(endpointId: String, featureIdToken: String, completion: @escaping (Bool) -> Void) -> Void
}

protocol EndpointInfoProtocol: Decodable {
    var url: String { get }
    var auth: String { get }
}

struct EndpointInfo: EndpointInfoProtocol {
    let url: String
    let auth: String
}

class Endpoint: EndpointProtocol {
    
    init() {
        delegate = nil
    }
    
    var delegate: EndpointDelegate?
    
    func approveEndpointFetch(endpointId: String, featureIdToken: String, completion: @escaping (Bool) -> Void) -> Void {
        delegate?.doHandleApproveEndpointFetch(endpointId: endpointId, featureIdToken: featureIdToken, completion: completion)
    }
    
    private func endpointInfoFromId(endpointId: String) -> EndpointInfo? {
        let endpointsPath = Bundle.main.bundleURL
            .appendingPathComponent("config/endpoints.json")
        guard let endpointsJsonData = (try? Data(contentsOf: endpointsPath)) else { return nil }
        guard let endpointsJson = (try? JSONDecoder().decode(Dictionary<String,EndpointInfo>.self, from: endpointsJsonData)) else { return nil }
        return endpointsJson[endpointId]
    }
    
    let network: Network = Network()
    func send(endpointId: String, featureIdToken: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (String) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId, featureIdToken: featureIdToken) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler("403")
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler("404")
                return
            }
            guard let response = self.network.httpPost(url: endpointInfo.url, body: payload, contentType: contentType, authorization: endpointInfo.auth) else {
                Log.error("endpoint.get failed: Endpoint \(endpointId) could not be reached")
                completionHandler("404")
                return
            }
            completionHandler(response)
        }
    }
    
    func get(endpointId: String, featureIdToken: String, contentType: String?, authorization: String?, completionHandler: @escaping (String) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId, featureIdToken: featureIdToken) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler("403")
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler("404")
                return
            }
            guard let response = self.network.httpGet(url: endpointInfo.url, contentType: contentType, authorization: endpointInfo.auth) else {
                Log.error("endpoint.get failed: Endpoint \(endpointId) could not be reached")
                completionHandler("404")
                return
            }
            completionHandler(response)
        }
    }
}
