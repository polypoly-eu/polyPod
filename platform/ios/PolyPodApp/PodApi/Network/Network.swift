import Foundation

protocol NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authToken: String?
    ) -> Result<Data, PodApiError>
    
    func httpGet(
        url: String,
        contentType: String?,
        authToken: String?
    ) -> Result<Data, PodApiError>
}

final class Network: NetworkProtocol {
    func httpPost(
        url: String,
        body: String,
        contentType: String?,
        authToken: String?,
        allowInsecure: Bool
    ) -> Result<Data, PodApiError> {
        return httpFetchCall(type: "POST", url: url, body: body, contentType: contentType, authToken: authToken, allowInsecure: allowInsecure)
    }
    
    func httpGet(
        url: String,
        contentType: String?,
        authToken: String?,
        allowInsecure: Bool
    ) -> Result<Data, PodApiError> {
        return httpFetchCall(type: "GET", url: url, body: nil, contentType: contentType, authToken: authToken, allowInsecure: allowInsecure)
    }
    
    func httpFetchCall(
        type: String,
        url: String,
        body: String?,
        contentType: String?,
        authToken: String?,
        allowInsecure: Bool
    ) -> Result<Data, PodApiError>  {
            let requestURL = URL(string: url)!
            guard requestURL.scheme != nil else {
                return .failure(PodApiError.networkError(type, message: "Bad URL: \(url)"))
            }
            if (!allowInsecure && !(requestURL.scheme == "https")) {
                return .failure(PodApiError.networkSecurityError(type))
            }
            var request = URLRequest(url: requestURL)
            request.httpMethod = type
            if (body != nil) {
                request.httpBody = body!.data(using: .utf8)
            }
            
            if let contentType = contentType {
                request.setValue(contentType, forHTTPHeaderField: "Content-Type")
            }
            
            if let authToken = authToken {
                let encoded = Data(authToken.utf8).base64EncodedString()
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
                defer { semaphore.signal() }
                guard let response = response as? HTTPURLResponse,
                      error == nil else {
                          semaphore.signal()
                          return
                      }
                
                guard (200 ... 299) ~= response.statusCode else {
                    fetchError = PodApiError.networkError("http\(type)", message: "Bad response code: \(String(response.statusCode))")
                    semaphore.signal()
                    return
                }
                
                guard let data = data else {
                    fetchError = PodApiError.networkError("http\(type)", message: "Bad response code: \(String(response.statusCode))")
                    return
                }
                responseData = data
                semaphore.signal()
            }
            task.resume()
            semaphore.wait()
            
            if (responseData == nil && fetchError == nil) {
                fetchError = PodApiError.networkError("http\(type)", message: "Bad response code: 400")
            }
        
            return fetchError == nil ? .success(responseData!) : .failure(fetchError!)
    }
}
