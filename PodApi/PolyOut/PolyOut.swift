//
//  PolyOut.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyOut {
    
    func makeHttpRequest(urlString: String, requestInit: FetchRequestInit, completionHandler: @escaping (FetchResponse?) -> Void) {
        guard let url = URL(string: urlString) else {
            // todo: handle this
            completionHandler(nil)
            return
        }
        
        let method = requestInit.method ?? "GET"
        
        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        /*
        if let headers = initData["headers"] as? [String: String] {
            for (key, value) in headers {
                request.setValue(value, forHTTPHeaderField: key)
            }
        }
        */
        if let body = requestInit.body, body.count > 0 {
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
            
            let fetchResponse = FetchResponse(response: httpResponse, data: data)
            
            completionHandler(fetchResponse)
        })

        task.resume()
    }
}
