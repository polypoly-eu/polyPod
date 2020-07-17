//
//  PolyOut.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyOut {
    
    private let session: NetworkSession
    private let fileStoragePath: URL
    
    init(session: NetworkSession = URLSession.shared) {
        self.session = session
        
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        fileStoragePath = paths[0]
    }
    
    func fetch(urlString: String, requestInit: FetchRequestInit, completionHandler: @escaping (FetchResponse?, Error?) -> Void) {
        guard let url = URL(string: urlString) else {
            completionHandler(nil, PolyApiError.paramterMissing)
            return
        }

        let method = requestInit.method ?? "GET"
        
        var request = URLRequest(url: url)
        request.httpMethod = method.uppercased()
        
        //request.setValue("application/json", forHTTPHeaderField: "Content-Type")
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
        
        session.loadData(with: request, completionHandler: { (data, response, error) in
            if let error = error {
                completionHandler(nil, error)
                return
            }
            guard let httpResponse = response as? HTTPURLResponse else {
                completionHandler(nil, PolyApiError.unknown)
                return
            }
            
            let fetchResponse = FetchResponse(response: httpResponse, data: data)
            
            completionHandler(fetchResponse, nil)
        })
    }
    
    func stat(path: String, completionHandler: @escaping (FileStats?, Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
            
        var isDir : ObjCBool = false
        let exists = FileManager.default.fileExists(atPath: filePath.path, isDirectory: &isDir)
        if exists {
            completionHandler(FileStats(isDirectory: isDir.boolValue), nil)
        } else {
            completionHandler(nil, PolyApiError.noSuchFile)
        }
    }
    
    func fileRead(path: String, options: [String: Any], completionHandler: @escaping (Any?, Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        
        do {
            if "utf-8" == options["encoding"] as? String {
                let content = try String(contentsOf: filePath, encoding: String.Encoding.utf8)
                completionHandler(content, nil)
            } else {
                let content = try Data(contentsOf: filePath)
                completionHandler(content, nil)
            }
        } catch {
            completionHandler(nil, error)
        }
    }
    
    func fileWrite(path: String, data: String, completionHandler: @escaping (Error?) -> Void) {
        let filePath = fileStoragePath.appendingPathComponent(path)
        
        do {
           try data.write(to: filePath, atomically: false, encoding: String.Encoding.utf8)
           completionHandler(nil)
        } catch {
           completionHandler(error)
        }
    }
}
