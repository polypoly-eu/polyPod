import Foundation
import MessagePack

class ErrorUploader {
    static let shared = ErrorUploader()

    func uploadToServer(_ errorMsg: String,
                        completionHandler: @escaping (String?, String?) -> Void
    ) {
        let endpointId = "polyApiErrorReport"

        guard let endpointInfo = PodApi.shared.endpoint.endpointInfoFromId(endpointId: endpointId) else {
            Log.error("uploadToServer failed: No endpoint found for: \(endpointId)")
            completionHandler(
                "uploadToServer",
                "\(#function): No endpoint found for \(endpointId)"
            )
            return
        }
        let payload = jsonStringify([errorMsg])

        PodApi.shared.endpoint.send(
            endpointId: endpointId,
            payload: payload,
            contentType: "application/json",
            authToken: endpointInfo.auth
        ) { error in
            
            Log.debug("uploadToServer(): error in POST to \(endpointId), \(error!.localizedDescription)")
                        
            completionHandler(
                "uploadToServer",
                "Request to \(endpointId) failed: \(error!.localizedDescription)"
            )
        }
    }

    private func jsonStringify(_ objectToConvert: Any) -> String {
        var resultJson = ""
        if let json = try? JSONSerialization.data(withJSONObject: objectToConvert) {
            if let content = String(data: json, encoding: String.Encoding.utf8) {
                // here `content` is the JSON dictionary containing the String
                resultJson = content
            }
        }
        return resultJson
    }

}
