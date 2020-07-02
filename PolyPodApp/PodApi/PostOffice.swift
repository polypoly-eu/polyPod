//
//  PostOffice.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 27.05.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit

class PostOffice {

    static let shared = PostOffice()
    
    func handleIncomingEvent(eventData: [String: Any], completionHandler: @escaping ([UInt8]) -> Void) {
        guard let bytes = eventData as? [String: NSNumber] else { return }
        
        let sortedBytes = bytes.sorted(by: { $0.0.compare($1.0, options: .numeric) == .orderedAscending })
        let bytesArray = Array(sortedBytes.map({ $0.value.uint8Value }))

        let data = Data(bytes: bytesArray, count: bytesArray.count)

        let unpacked = try! unpackFirst(data)
        guard let decoded = Bubblewrap.decode(messagePackValue: unpacked) as? [String: Any] else {
            completionHandler([])
            return
        }

        let messageId = decoded["id"] as! UInt64
        let requestValue = decoded["request"]!
        let request = requestValue as! [[String: Any]]
        
        guard let api = request[0]["method"] as? String else {
            completionHandler([])
            return
        }
        
        guard let method = request[1]["method"] as? String else {
            completionHandler([])
            return
        }
        
        guard let args = request[1]["args"] as? [Any] else {
            completionHandler([])
            return
        }

        switch api {
        case "polyIn":
            handlePolyIn(method: method, args: args, completionHandler: { (response, error) in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        case "polyOut":
            handlePolyOut(method: method, args: args, completionHandler: { (response, error) in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        default:
            print("API unknown:", api)
        }
    }
    
    private func completeEvent(messageId: UInt64, response: MessagePackValue?, error: MessagePackValue?, completionHandler: @escaping ([UInt8]) -> Void) {
        var dict: [MessagePackValue: MessagePackValue] = [:]
        
        dict["id"] = .uint(messageId)
        if response != nil {
            dict["response"] = response
        }
        if error != nil {
            dict["error"] = error
        }
        
        let packedDict = pack(MessagePackValue.map(dict))

        let byteArrayFromData: [UInt8] = [UInt8](packedDict)
        
        completionHandler(byteArrayFromData)
    }
}

extension PostOffice {
    private func handlePolyIn(method: String, args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        switch method {
        case "add":
            handlePolyInAdd(args: args, completionHandler: completionHandler)
        case "select":
            handlePolyInSelect(args: args, completionHandler: completionHandler)
        default:
            print("PolyIn method unknown:", method)
        }
    }
    
    private func handlePolyInAdd(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        var extendedDataSet: [ExtendedData] = []
        
        for arg in args {
            guard let extendedData = arg as? ExtendedData else {
                completionHandler(nil, MessagePackValue("Bad data"))
                return
            }

            guard let graph = extendedData.properties["graph"] as? ExtendedData, graph.classname == "@polypoly-eu/rdf.DefaultGraph" else {
                completionHandler(nil, MessagePackValue("/default/"))
                return
            }
            
            extendedDataSet.append(extendedData)
        }
        
        PodApi.shared.polyIn.addQuads(quads: extendedDataSet) { didSave in
            if didSave {
                completionHandler(MessagePackValue(), nil)
            } else {
                completionHandler(nil, MessagePackValue("Failed"))
            }
        }
    }
    
    private func handlePolyInSelect(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        guard let extendedData = args[0] as? ExtendedData else {
            completionHandler(nil, MessagePackValue("Bad data"))
            return
        }
        
        PodApi.shared.polyIn.selectQuads(matcher: extendedData) { quads in
            guard let quads = quads else {
                completionHandler(nil, MessagePackValue("Bad data"))
                return
            }
            
            var encodedQuads: [MessagePackValue] = []
            for quad in quads {
                let encodedQuad = Bubblewrap.encode(extendedData: quad)
                encodedQuads.append(encodedQuad)
            }
            completionHandler(.array(encodedQuads), nil)
        }
    }
}

extension PostOffice {
    private func handlePolyOut(method: String, args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        switch method {
        case "fetch":
            handlePolyOutFetch(args: args, completionHandler: completionHandler)
        case "stat":
            handlePolyOutStat(args: args, completionHandler: completionHandler)
        case "readFile":
            handlePolyOutReadFile(args: args, completionHandler: completionHandler)
        case "writeFile":
            handlePolyOutWriteFile(args: args, completionHandler: completionHandler)
        default:
            print("PolyOut method unknown:", method)
        }
    }
    
    private func handlePolyOutFetch(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let url = args[0] as! String
        let requestInitData = args[1] as! [String: Any]
        
        let fetchRequestInit = FetchRequestInit(with: requestInitData)
        
        PodApi.shared.polyOut.fetch(urlString: url, requestInit: fetchRequestInit) { fetchResponse in
            guard let fetchResponse = fetchResponse else {
                // todo: handle error
                completionHandler(nil, MessagePackValue())
                return
            }
            
            let data = MessagePackValue.array(["@polypoly-eu/podigree.FetchResponse", .array(fetchResponse.messagePackArray)])
                
            let packedData = pack(data)
                
            completionHandler(MessagePackValue(type: 2, data: packedData), nil)
        }
    }
    
    private func handlePolyOutStat(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        
        PodApi.shared.polyOut.stat(path: path) { fileExists in
            if fileExists {
                completionHandler(MessagePackValue(), nil)
            } else {
                completionHandler(nil, MessagePackValue())
            }
        }
    }
    
    private func handlePolyOutReadFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        
        PodApi.shared.polyOut.fileRead(path: path) { (fileContent, error) in
            if let fileContent = fileContent {
                completionHandler(.string(fileContent), nil)
            } else {
                completionHandler(nil, MessagePackValue())
            }
        }
    }
    
    private func handlePolyOutWriteFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        let data = args[1] as! String
        
        PodApi.shared.polyOut.fileWrite(path: path, data: data) { error in
            if error != nil {
                completionHandler(nil, MessagePackValue())
            } else {
                completionHandler(MessagePackValue(), nil)
            }
        }
    }
}
