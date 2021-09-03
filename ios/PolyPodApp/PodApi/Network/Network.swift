import Foundation

protocol NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> Bool
}

class Network: NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> Bool {
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
        var success = false
        let task = URLSession.shared.dataTask(with: request) {
            data, response, error in
            guard let response = response as? HTTPURLResponse,
                  error == nil else {
                print("error", error ?? "httpPost: Unknown error")
                semaphore.signal()
                return
            }
            
            guard (200 ... 299) ~= response.statusCode else {
                print("Non-OK status code: \(response.statusCode)")
                semaphore.signal()
                return
            }
            
            success = true
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        return success
    }
}
