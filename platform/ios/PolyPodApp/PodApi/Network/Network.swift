import Foundation

protocol NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> Error?
    
    func httpGet(
        url: String,
        contentType: String?,
        authorization: String?
    ) -> Result<Data, PodApiError>
}

final class Network: NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authorization: String?
    ) -> Error? {
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
        var fetchError: Error? = nil
        let task = URLSession.shared.dataTask(with: request) {
            data, response, error in
            guard let response = response as? HTTPURLResponse,
                  error == nil else {
                      fetchError = PodApiError.networkError("httpPost", responseCode: "400")
                      semaphore.signal()
                      return
                  }
            
            guard (200 ... 299) ~= response.statusCode else {
                fetchError = PodApiError.networkError("httpPost", responseCode: String(response.statusCode))
                semaphore.signal()
                return
            }
            
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        
        if let fetchError = fetchError {
            Log.error(fetchError.localizedDescription)
        }
        return fetchError
    }
    
    func httpGet(
        url: String,
        contentType: String?,
        authorization: String?
    ) -> Result<Data, PodApiError> {
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
        var fetchError: PodApiError? = nil
        var responseData: Data? = nil
        let task = URLSession.shared.dataTask(with: request) {
            data, response, error in
            guard let response = response as? HTTPURLResponse,
                  error == nil else {
                      semaphore.signal()
                      return
                  }
            
            guard (200 ... 299) ~= response.statusCode else {
                fetchError = PodApiError.networkError("httpGet", responseCode: String(response.statusCode))
                semaphore.signal()
                return
            }
            
            guard let data = data else {
                fetchError = PodApiError.networkError("httpGet", responseCode: String(response.statusCode))
                return
            }
            responseData = data
            semaphore.signal()
        }
        task.resume()
        semaphore.wait()
        
        guard responseData != nil && fetchError != nil else {
            return .failure(fetchError!)
        }
        
        return fetchError == nil ? .success(responseData!) : .failure(fetchError!)
    }
}
