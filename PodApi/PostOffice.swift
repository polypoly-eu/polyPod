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
    
    func handleIncomingEvent(eventData: [String: Any], completionHandler: @escaping (Data) -> Void) {
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
            completionHandler(Data())
            return
        }

        if api == "polyOut" {
            handlePolyOut(messageId: messageId, request: request[1], completionHandler: { response in
                self.completeEvent(messageId: messageId, response: response, completionHandler: completionHandler)
            })
        }
    }
    
    private func completeEvent(messageId: MessagePackValue, response: MessagePackValue, completionHandler: @escaping (Data) -> Void) {
        var dict: [MessagePackValue: MessagePackValue] = [:]
        
        dict[MessagePackValue("id")] = messageId
        dict[MessagePackValue("response")] = response
        
        let packedDict = pack(MessagePackValue.map(dict))

        completionHandler(packedDict)
    }
    
    private func handlePolyOut(messageId: MessagePackValue, request: MessagePackValue, completionHandler: @escaping (MessagePackValue) -> Void) {
        let method = request[MessagePackValue("method")]
        
        if method == "fetch" {
            handlePolyOutFetch(messageId: messageId, request: request, completionHandler: completionHandler)
        }
    }
    
    private func handlePolyOutFetch(messageId: MessagePackValue, request: MessagePackValue, completionHandler: @escaping (MessagePackValue) -> Void) {
        let argsValue = request[MessagePackValue("args")]!
        let args = argsValue.arrayValue!
        
        let url = args[0].stringValue!

        sharedPodApi.polyOut.makeHttpRequest(urlString: url, requestData: [:]) { (response) in
            if let response = response {
                let bufferedText = MessagePackValue.array([.string("bufferedText"), .string(response)])
                let ok = MessagePackValue.array([.string("ok"), .bool(true)])
                let redirected = MessagePackValue.array([.string("redirected"), .bool(false)])
                let status = MessagePackValue.array([.string("status"), .int(200)])
                let statusText = MessagePackValue.array([.string("statusText"), .string("OK")])
                let type = MessagePackValue.array([.string("type"), .string("basic")])
                let url = MessagePackValue.array([.string("url"), .string("http://example.org/")])
                
                let a = MessagePackValue.array([.string("@polypoly-eu/podigree.FetchResponse"), [bufferedText, ok, redirected, status, statusText, type, url]])
                
                let packedResponse = pack(a)
                
                completionHandler(MessagePackValue(type: 2, data: packedResponse))
            } else {
                completionHandler(MessagePackValue())
            }
        }
    }
}
