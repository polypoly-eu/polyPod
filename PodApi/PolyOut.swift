//
//  PolyOut.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyOut {
    
    func makeHttpRequest(requestData: [String: Any], completionHandler: @escaping (String?) -> ()) {
        guard let urlString = requestData["url"] as? String, let url = URL(string: urlString) else {
            completionHandler(nil)
            return
        }
        
        guard let method = requestData["method"] as? String else {
            completionHandler(nil)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        if let rawHeaders = requestData["headers"] as? String, let headers = try? JSONSerialization.jsonObject(with: rawHeaders.data(using: .utf8)!, options: []) as? NSDictionary {
            for (key, value) in headers {
                request.setValue(value as? String, forHTTPHeaderField: key as! String)
            }
        }
        
        if let body = requestData["body"] as? String, body.count > 0 {
            let postString = body
            request.httpBody = postString.data(using: .utf8)
        }
        
        let task = URLSession.shared.dataTask(with: request) {(data, response, error) in
            guard let data = data else { return }
            let result = String(data: data, encoding: .utf8)
            completionHandler(result)
        }

        task.resume()
    }
}
