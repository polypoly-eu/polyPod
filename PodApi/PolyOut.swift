//
//  PolyOut.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyOut {
    
    func makeHttpRequest(urlString: String, requestData: [String: Any], completionHandler: @escaping (Data?, URLResponse?, Error?) -> ()) {
        guard let url = URL(string: urlString) else {
            completionHandler(nil, nil, nil)
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
        
        let task = URLSession.shared.dataTask(with: request, completionHandler: completionHandler)

        task.resume()
    }
}
