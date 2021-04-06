//
//  NetworkSession.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 12.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

protocol NetworkSession {
    func loadData(with request: URLRequest, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void)
}

extension URLSession: NetworkSession {
    func loadData(with request: URLRequest, completionHandler: @escaping (Data?, URLResponse?, Error?) -> Void) {
        let task = dataTask(with: request) { (data, response, error) in
            completionHandler(data, response, error)
        }

        task.resume()
    }
}
