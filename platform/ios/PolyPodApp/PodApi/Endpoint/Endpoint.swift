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

    private func approveEndpointFetch(endpointId: String, completion: @escaping (Bool) -> Void) {
        delegate?.doHandleApproveEndpointFetch(endpointId: endpointId, completion: completion)
    }
    
    private func jsonStringify(_ objectToConvert: Any) -> Any {
        if let jsonData = try? JSONSerialization.data(withJSONObject: objectToConvert, options: []) {
             if let content = String(data: jsonData, encoding: String.Encoding.utf8) {
                // here `content` is the JSON dictionary containing the String
                return content
            }
        }
        return ""
    }
    
    func uploadError(
        errorMsg: String,
        endpointId: String,
        completionHandler: @escaping (Error?) -> Void
    ) {
        if errorMsg.isEmpty {
            completionHandler(PodApiError.endpointError("Empty payload!"))
        }

        guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
            Log.error("uploadError failed: No endpoint found for: \(endpointId)")
            completionHandler(
                PodApiError.endpointError("post, no endpoint found for: \(endpointId)")
            )
            return
        }
        
        let payload = "{ \"error\": \(jsonStringify([errorMsg])) }"
    
        let response = self.network.httpPost(
            url: endpointInfo.url,
            body: payload,
            contentType: "application/json; charset=utf-8",
            authToken: endpointInfo.auth,
            allowInsecure: endpointInfo.allowInsecure
        )

        switch response {
        case .failure(let error):
            Log.error("uploadError(): endpoint.post to \(endpointId) failed with: \(error.localizedDescription)")
            let errorCode = response.map { "failed with code \($0)" }
            completionHandler(PodApiError.endpointError("post \(errorCode)"))
        case .success:
            completionHandler(nil)
        }

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
                Log.error("Permission to send information to endpoint \(endpointId) denied by the user.")
                completionHandler(PodApiError.userDeniedPermission("post"))
                return
            }

            guard let endpointInfo = self.endpointInfoFromId(endpointId: endpointId) else {
                Log.error("endpoint.post failed: No endpoint found for: \(endpointId)")
                completionHandler(PodApiError.endpointError("post"))
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
                Log.error("endpoint.post failed: \(error.localizedDescription)")
                let errorCode = response.map { "failed with code \($0)" }
                completionHandler(PodApiError.endpointError("post \(errorCode)"))
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
                Log.error("Permission to get information from endpoint \(endpointId) denied by the user.")
                completionHandler(nil, PodApiError.userDeniedPermission("get"))
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

    func endpointInfoFromId(endpointId: String) -> EndpointInfo? {
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

}
