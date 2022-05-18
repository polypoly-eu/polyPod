import Foundation
import MessagePack

class ErrorUploader {
    static let shared = ErrorUploader()

    func uploadToServer(_ errorMsg: String, 
        completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void
    ) {
        let endpointId = "polyApiErrorReport"
        let authToken = getEnvironmentVar("POLYPOD_ERROR_REPORT_AUTHORIZATION")
        let payload = jsonStringify(["errorMsg"])

        PodApi.shared.endpoint.send(
            endpointId: endpointId,
            payload: payload,
            contentType: "application/json",
            authToken: authToken
        ) { error in
            print("error in POST error=", error?.localizedDescription)
            completionHandler(
                .nil,
                error == nil ? nil :
                MessagePackValue("\(#function): \(String(describing: error?.localizedDescription))")
            )
        
        }
    }
    
    private func jsonStringify(_ objectToConvert: Any) -> String {
        var resultJson = ""
        if let json = try? JSONSerialization.data(withJSONObject: objectToConvert)
        {
            if let content = String(data: json, encoding: String.Encoding.utf8) {
                // here `content` is the JSON dictionary containing the String
                resultJson = content
            }
        }
        return resultJson
    }

    private func getEnvironmentVar(_ name: String) -> String? {
        guard let rawValue = getenv(name) else { return nil }
        return String(utf8String: rawValue)
    }

}
