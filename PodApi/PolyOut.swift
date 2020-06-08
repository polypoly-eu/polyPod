//
//  PolyOut.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyOut {
    
    func makeHttpRequest(urlString: String, requestData: [String: Any], completionHandler: @escaping ([String: Any]?) -> Void) {
        guard let url = URL(string: urlString) else {
            // todo: handle this
            completionHandler(nil)
            return
        }
        
        let initData = requestData["init"] as? [String: Any] ?? [:]
        
        let method = initData["method"] as? String ?? "GET"
        
        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let headers = initData["headers"] as? [String: String] {
            for (key, value) in headers {
                request.setValue(value, forHTTPHeaderField: key)
            }
        }
        
        if let body = initData["body"] as? String, body.count > 0 {
            let postString = body
            request.httpBody = postString.data(using: .utf8)
        }
        
        let task = URLSession.shared.dataTask(with: request, completionHandler: { (data, response, error) in
            if let error = error {
                // todo: handle error
                completionHandler(nil)
                return
            }
            guard let httpResponse = response as? HTTPURLResponse else {
                // todo: handle this
                completionHandler(nil)
                return
            }
            
            var responseData: [String: Any] = [:]
            
            if let data = data {
                let responseString = String(data: data, encoding: .utf8)!
                responseData["bufferedText"] = responseString
            }
            
            responseData["ok"] = true
            responseData["redirected"] = false
            responseData["status"] = httpResponse.statusCode
            responseData["statusText"] = "OK"
            responseData["type"] = "basic"
            responseData["url"] = httpResponse.url?.absoluteString ?? ""
            
            completionHandler(responseData)
        })

        task.resume()
    }
}
