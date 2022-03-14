import Foundation
import MessagePack

protocol EndpointProtocol {
    func send(endpointId: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (Error?) -> Void) -> Void
    func get(endpointId: String, contentType: String?, authorization: String?, completionHandler: @escaping (String?, Error?) -> Void) -> Void
}

protocol EndpointDelegate {
    func doHandleApproveEndpointFetch(endpointId: String, completion: @escaping (Bool) -> Void) -> Void
}

struct EndpointInfo: Decodable {
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
    let network: Network = Network()
    
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
    
    func send(endpointId: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (Error?) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId) { approved in
            if (!approved) {
                
                Log.error("endpoint.send failed: Permission for endpoint \(endpointId) denied")
                completionHandler(PodApiError.endpointError("send"))
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.send failed: No endpoint found for: \(endpointId)")
                completionHandler(PodApiError.endpointError("send"))
                return
            }
            let error = self.network.httpPost(url: endpointInfo.url, body: payload, contentType: contentType, authorization: endpointInfo.auth)
            if (error == nil) {
                completionHandler(nil)
            } else {
                completionHandler(PodApiError.endpointError("send"))
            }
        }
    }
    
    func get(endpointId: String, contentType: String?, authorization: String?, completionHandler: @escaping (String?, Error?) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler(nil, PodApiError.endpointError("get"))
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler(nil, PodApiError.endpointError("get"))
                return
            }
            let response = self.network.httpGet(url: endpointInfo.url, contentType: contentType, authorization: endpointInfo.auth)
            switch response {
            case .failure(_):
                completionHandler(nil, PodApiError.endpointError("get"))
            case .success(let responseData):
                completionHandler(responseData, nil)
        }
        }
    }
}
