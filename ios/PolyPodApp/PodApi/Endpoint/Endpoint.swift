import Foundation

protocol EndpointProtocol {
    func send(endpointId: String, featureIdToken: String, payload: String, contentType: String?, authorization: String?) -> String?
    func get(endpointId: String, featureIdToken: String, contentType: String?, authorization: String?) -> String?
}

protocol EndpointDelegate {
    func doHandleApproveEndpointFetch(endpointId: String, featureIdToken: String) -> Bool
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
    
    func approveEndpointFetch(endpointId: String, featureIdToken: String) -> Bool {
        guard let result = delegate?.doHandleApproveEndpointFetch(endpointId: endpointId, featureIdToken: featureIdToken) else { return false }
        return result
        }
    
    private func endpointInfoFromId(endpointId: String) -> EndpointInfo? {
        let endpointsPath = Bundle.main.bundleURL
            .appendingPathComponent("config/endpoints.json")
        guard let endpointsJsonData = (try? Data(contentsOf: endpointsPath)) else { return nil }
        guard let endpointsJson = (try? JSONDecoder().decode(Dictionary<String,EndpointInfo>.self, from: endpointsJsonData)) else { return nil }
        return endpointsJson[endpointId]
    }
    
    let network: Network = Network()
    func send(endpointId: String, featureIdToken: String, payload: String, contentType: String?, authorization: String?) -> String? {
        print(approveEndpointFetch(endpointId: endpointId, featureIdToken: featureIdToken))
        guard let endpointInfo = endpointInfoFromId(endpointId: endpointId) else {
            Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
            return nil
        }
        let response = network.httpPost(url: endpointInfo.url,body: payload , contentType: contentType, authorization: endpointInfo.auth)
        return response
    }
    
    func get(endpointId: String, featureIdToken: String, contentType: String?, authorization: String?) -> String? {
        guard let endpointInfo = endpointInfoFromId(endpointId: endpointId) else {
            Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
            return nil
        }
        let response = network.httpGet(url: endpointInfo.url, contentType: contentType, authorization: endpointInfo.auth)
        return response
    }
}
