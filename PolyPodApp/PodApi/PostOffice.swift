//
//  PostOffice.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 27.05.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit

class PostOffice: NSObject {

    static let shared = PostOffice()
    
    func handleIncomingEvent(eventData: [String: Any], completionHandler: @escaping ([UInt8]) -> Void) {
        guard let bytes = eventData as? [String: NSNumber] else { return }
        
        let sortedBytes = bytes.sorted(by: { $0.0.compare($1.0, options: .numeric) == .orderedAscending })
        let bytesArray = Array(sortedBytes.map({ $0.value.uint8Value }))

        let data = Data(bytes: bytesArray, count: bytesArray.count)

        let unpacked = try! unpackAll(data)
        let unpackedDict = unpacked[0].dictionaryValue!

        let messageId = unpackedDict[MessagePackValue("id")]!
        let requestValue = unpackedDict[MessagePackValue("request")]!
        let request = requestValue.arrayValue!
        
        guard let api = request[0][MessagePackValue("method")] else {
            completionHandler([])
            return
        }

        if api == "polyOut" {
            handlePolyOut(request: request[1], completionHandler: { (response, error) in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        }
    }
    
    private func completeEvent(messageId: MessagePackValue, response: MessagePackValue?, error: MessagePackValue?, completionHandler: @escaping ([UInt8]) -> Void) {
        var dict: [MessagePackValue: MessagePackValue] = [:]
        
        dict["id"] = messageId
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
    
    private func handlePolyOut(request: MessagePackValue, completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let method = request[MessagePackValue("method")]
        
        switch method {
        case "fetch":
            handlePolyOutFetch(request: request, completionHandler: completionHandler)
        case "stat":
            handlePolyOutStat(request: request, completionHandler: completionHandler)
        case "readFile":
            handlePolyOutReadFile(request: request, completionHandler: completionHandler)
        case "writeFile":
            handlePolyOutWriteFile(request: request, completionHandler: completionHandler)
        default:
            print("Method unknown", method)
        }
    }
    
    private func handlePolyOutFetch(request: MessagePackValue, completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let argsValue = request[MessagePackValue("args")]!
        let args = argsValue.arrayValue!
        
        let url = args[0].stringValue!
        let requestInitData = args[1].dictionaryValue!
        
        let fetchRequestInit = FetchRequestInit(initData: requestInitData)
        
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
    
    private func handlePolyOutStat(request: MessagePackValue, completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let argsValue = request[MessagePackValue("args")]!
        let args = argsValue.arrayValue!
        
        let path = args[0].stringValue!
        
        PodApi.shared.polyOut.stat(path: path) { fileExists in
            if fileExists {
                completionHandler(MessagePackValue(), nil)
            } else {
                completionHandler(nil, MessagePackValue())
            }
        }
    }
    
    private func handlePolyOutReadFile(request: MessagePackValue, completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let argsValue = request[MessagePackValue("args")]!
        let args = argsValue.arrayValue!
        
        let path = args[0].stringValue!
        
        PodApi.shared.polyOut.fileRead(path: path) { (fileContent, error) in
            if let fileContent = fileContent {
                completionHandler(.string(fileContent), nil)
            } else {
                completionHandler(nil, MessagePackValue())
            }
        }
    }
    
    private func handlePolyOutWriteFile(request: MessagePackValue, completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let argsValue = request[MessagePackValue("args")]!
        let args = argsValue.arrayValue!
        
        let path = args[0].stringValue!
        let data = args[1].stringValue!
        
        PodApi.shared.polyOut.fileWrite(path: path, data: data) { error in
            if error != nil {
                completionHandler(nil, MessagePackValue())
            } else {
                completionHandler(MessagePackValue(), nil)
            }
        }
    }
}
