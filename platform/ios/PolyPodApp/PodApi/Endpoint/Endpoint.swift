import Foundation
import MessagePack

protocol EndpointProtocol {
    func send(endpointId: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (EndpointResponse) -> Void) -> Void
    func get(endpointId: String, contentType: String?, authorization: String?, completionHandler: @escaping (EndpointResponse) -> Void) -> Void
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

struct EndpointResponse {
    let payload: String?
    let responseCode: Int
    public var messagePackObject: MessagePackValue {
        var messagePackMap: [MessagePackValue: MessagePackValue] = [:]
        messagePackMap["payload"] = payload != nil ? .string(payload!) : .nil
        messagePackMap["responseCode"] = .int(Int64(responseCode))
        return MessagePackValue.map(messagePackMap)
    }
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
    func send(endpointId: String, payload: String, contentType: String?, authorization: String?, completionHandler: @escaping (EndpointResponse) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler(EndpointResponse(payload: nil, responseCode: 601))
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler(EndpointResponse(payload: nil, responseCode: 604))
                return
            }
            let response = self.network.httpPost(url: endpointInfo.url, body: payload, contentType: contentType, authorization: endpointInfo.auth)
            completionHandler(EndpointResponse(payload: response.payload, responseCode: response.responseCode))
        }
    }
    
    func get(endpointId: String, contentType: String?, authorization: String?, completionHandler: @escaping (EndpointResponse) -> Void) -> Void {
        approveEndpointFetch(endpointId: endpointId) { approved in
            if (!approved) {
                Log.error("endpoint.get failed: Permission for endpoint \(endpointId) denied")
                completionHandler(EndpointResponse(payload: nil, responseCode: 601))
                return
            }
            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.get failed: No endpoint found for: \(endpointId)")
                completionHandler(EndpointResponse(payload: nil, responseCode: 604))
                return
            }
            let response = self.network.httpGet(url: endpointInfo.url, contentType: contentType, authorization: endpointInfo.auth)
            completionHandler(EndpointResponse(payload: response.payload, responseCode: response.responseCode))
        }
    }
}
