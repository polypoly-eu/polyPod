import Foundation
import MessagePack

protocol EndpointProtocol: AnyObject {
    func send(
        endpointId: String, 
        payload: String, 
        contentType: String?, 
        authToken: String?, 
        completionHandler: @escaping (Error?) -> Void
    )
    func get(
        endpointId: String, 
        contentType: String?,
        authToken: String?, 
        completionHandler: @escaping (String?, Error?) -> Void
    )
}

protocol EndpointDelegate: AnyObject {
    func doHandleApproveEndpointFetch(
        endpointId: String, 
        completion: @escaping (Bool) -> Void
    )
}

struct EndpointInfo: Decodable {
    let url: String
    let auth: String?
    var allowInsecure: Bool = false
}

final class Endpoint: EndpointProtocol {
    
    init() {
        delegate = nil
    }
    
    let network: Network = Network()
    var delegate: EndpointDelegate?
    
    func approveEndpointFetch(endpointId: String, completion: @escaping (Bool) -> Void) {
        delegate?.doHandleApproveEndpointFetch(endpointId: endpointId, completion: completion)
    }
    
    private func endpointInfoFromId(endpointId: String) -> EndpointInfo? {
        let endpointsPath = 
            Bundle.main.bundleURL.appendingPathComponent("config/endpoints.json")
        guard let endpointsJsonData = (try? Data(contentsOf: endpointsPath)) else { return nil }
        guard let endpointsJson = (
            try? JSONDecoder().decode(
                Dictionary<String, EndpointInfo>.self, 
                from: endpointsJsonData
                )
            ) else { 
                return nil 
            }
        return endpointsJson[endpointId]
    }
    
    func send(
        endpointId: String, 
        payload: String, 
        contentType: String?, 
        authToken: String?, 
        completionHandler: @escaping (Error?) -> Void
        ) {
        approveEndpointFetch(endpointId: endpointId) { approved in
            guard approved else {
                Log.error("endpoint.send failed: Permission for endpoint \(endpointId) denied")
                completionHandler(PodApiError.endpointError("send"))
                return
            }

            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.send failed: No endpoint found for: \(endpointId)")
                completionHandler(PodApiError.endpointError("send"))
                return
            }

            let response = self.network.httpPost(
                url: endpointInfo.url, 
                body: payload, 
                contentType: contentType, 
                authToken: endpointInfo.auth, 
                allowInsecure: endpointInfo.allowInsecure
            )
            switch response {
            case .failure(let error):
                Log.error(error.localizedDescription)
                completionHandler(PodApiError.endpointError("send"))
            case .success:
                completionHandler(nil)
            }
        }
    }
    
    func get(
        endpointId: String, 
        contentType: String?, 
        authToken: String?, 
        completionHandler: @escaping (String?, Error?) -> Void
        ) {
        approveEndpointFetch(endpointId: endpointId) { approved in
            guard approved else {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler(nil, PodApiError.endpointError("get"))
                return
            }

            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler(nil, PodApiError.endpointError("get"))
                return
            }

            let response = self.network.httpGet(
                url: endpointInfo.url, 
                contentType: contentType, 
                authToken: endpointInfo.auth, 
                allowInsecure: endpointInfo.allowInsecure
            )
            switch response {
            case .failure(let error):
                Log.error(error.localizedDescription)
                completionHandler(nil, PodApiError.endpointError("get"))
            case .success(let responseData):
                completionHandler(String(data: responseData, encoding: .utf8)!, nil)
            }
        }
    }

    private func approveEndpointFetch(endpointId: String, completion: @escaping (Bool) -> Void) -> Void {
        delegate?.doHandleApproveEndpointFetch(endpointId: endpointId, completion: completion)
    }

    private func endpointInfoFromId(endpointId: String) -> EndpointInfo? {
        let endpointsPath = Bundle.main.bundleURL
            .appendingPathComponent("config/endpoints.json")
        guard let endpointsJsonData = (try? Data(contentsOf: endpointsPath)) else { return nil }
        guard let endpointsJson = (try? JSONDecoder().decode(Dictionary<String, EndpointInfo>.self, from: endpointsJsonData)) else { return nil }
        return endpointsJson[endpointId]
    }

}
