import Foundation

protocol NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> Void
}

class Network: NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) {
        var request = URLRequest(url: URL(string: url)!)
        request.httpMethod = "POST"
        request.httpBody = body.data(using: .utf8)
        
        if let contentType = contentType {
            request.setValue(contentType, forHTTPHeaderField: "Content-Type")
        }
        
        if let authorization = authorization {
            let encoded = Data(authorization.utf8).base64EncodedString()
            request.setValue(
                "Basic \(encoded)",
                forHTTPHeaderField: "Authorization"
            )
        }
        
        let task = URLSession.shared.dataTask(with: request) {
            data, response, error in
            guard let response = response as? HTTPURLResponse,
                  error == nil else {
                print("error", error ?? "httpPost: Unknown error")
                return
            }
            
            guard (200 ... 299) ~= response.statusCode else {
                print("Non-OK status code: \(response.statusCode)")
                return
            }
        }
        task.resume()
    }
}
