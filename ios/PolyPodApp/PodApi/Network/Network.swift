import Foundation

protocol NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> String?
}

class Network: NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> String? {
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
        
        let semaphore = DispatchSemaphore(value: 0)
        var errorMessage: String? = nil
        let task = URLSession.shared.dataTask(with: request) {
            data, response, error in
            guard let response = response as? HTTPURLResponse,
                  error == nil else {
                errorMessage = error?.localizedDescription ?? "Unknown error"
                semaphore.signal()
                return
            }
            
            guard (200 ... 299) ~= response.statusCode else {
                errorMessage = "Bad response code: \(response.statusCode)"
                semaphore.signal()
                return
            }
            
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        
        if let errorMessage = errorMessage {
            print("network.httpPost failed: \(errorMessage)")
        }
        return errorMessage
    }
}
