import Foundation

protocol NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> NetworkResponse
    
    func httpGet(
        url: String,
        contentType: String?,
        authorization: String?
    ) -> NetworkResponse
}

struct NetworkResponse {
    let payload: String?
    let responseCode: Int
}

class Network: NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> NetworkResponse {
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
        var responseData: String? = nil
        var responseCode: Int = 400
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
            
            guard let data = data else { return }
            responseData = String(data: data, encoding: .utf8)!
            responseCode = response.statusCode
            
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        
        if let errorMessage = errorMessage {
            Log.error("network.httpPost failed: \(errorMessage)")
        }
        return NetworkResponse(payload: responseData, responseCode: responseCode)
    }
    
    func httpGet(
        url: String,
        contentType: String?,
        authorization: String?
    ) -> NetworkResponse {
        var request = URLRequest(url: URL(string: url)!)
        request.httpMethod = "GET"
        
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
        var responseData: String? = nil
        var responseCode: Int = 400
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
            guard let data = data else { return }
            responseData = String(data: data, encoding: .utf8)!
            responseCode = response.statusCode
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        
        
        
        if let errorMessage = errorMessage {
            Log.error("network.httpGet failed: \(errorMessage)")
        }
        
        return NetworkResponse(payload: responseData, responseCode: responseCode)
    }
}
