import Foundation

protocol NetworkProtocol {
    func httpPost(url: String, contentType: String, body: String) -> Void
}

class Network: NetworkProtocol {
    func httpPost(url: String, contentType: String, body: String) {
        var request = URLRequest(url: URL(string: url)!)
        request.setValue(contentType, forHTTPHeaderField: "Content-Type")
        request.httpMethod = "POST"
        request.httpBody = body.data(using: .utf8)
        
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
