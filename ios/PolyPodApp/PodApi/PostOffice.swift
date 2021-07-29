import UIKit
import MessagePack

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
            handlePolyIn(method: method, args: args, completionHandler: { response, error in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        case "polyOut":
            handlePolyOut(method: method, args: args, completionHandler: { response, error in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        case "polyNav":
            handlePolyNav(method: method, args: args, completionHandler: { response, error in
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
        case "match":
            handlePolyInSelect(args: args, completionHandler: completionHandler)
        case "delete":
            handlePolyInDelete(args: args, completionHandler: completionHandler)
        case "has":
            handlePolyInHas(args: args, completionHandler: completionHandler)
        default:
            print("PolyIn method unknown:", method)
        }
    }

    private func convertArgs(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) -> [ExtendedData] {
        var extendedDataSet: [ExtendedData] = []
        
        for arg in args {
            guard let extendedData = arg as? ExtendedData else {
                completionHandler(nil, MessagePackValue("Bad data"))
                return extendedDataSet
            }
            
            guard let graph = extendedData.properties["graph"] as? ExtendedData, graph.classname == "@polypoly-eu/rdf.DefaultGraph" else {
                completionHandler(nil, MessagePackValue("/default/"))
                return extendedDataSet
            }
            
            extendedDataSet.append(extendedData)
        }
        return extendedDataSet
    }
    
    private func handlePolyInAdd(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let extendedDataSet = convertArgs(args: args, completionHandler: completionHandler)

        PodApi.shared.polyIn.addQuads(quads: extendedDataSet) { didSave in
            if didSave {
                completionHandler(MessagePackValue(), nil)
            } else {
                completionHandler(nil, MessagePackValue("Failed"))
            }
        }
    }
    
    private func handlePolyInSelect(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        guard let extendedData = extractMatcher(args[0]) else {
            completionHandler(nil, MessagePackValue("Bad data"))
            return
        }
        PodApi.shared.polyIn.selectQuads(matcher: extendedData) { quads, error in
            if let error = error {
                completionHandler(nil, MessagePackValue(error.localizedDescription))
                return
            }
            
            guard let quads = quads else {
                completionHandler(nil, MessagePackValue(PodApiError.unknown.localizedDescription))
                return
            }
            
            var encodedQuads: [MessagePackValue] = []
            for quad in quads {
                let encodedQuad = MessagePackValue.extended(2, pack(Bubblewrap.encode(extendedData: quad)))
                encodedQuads.append(encodedQuad)
            }
            completionHandler(.array(encodedQuads), nil)
        }
    }
    
    private func handlePolyInDelete(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let extendedDataSet = convertArgs(args: args, completionHandler: completionHandler)
        
        PodApi.shared.polyIn.deleteQuads(quads: extendedDataSet) { didDelete in
            if didDelete {
                completionHandler(MessagePackValue(), nil)
            } else {
                completionHandler(nil, MessagePackValue("Failed"))
            }
        }
    }
    
    private func handlePolyInHas(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let extendedDataSet = convertArgs(args: args, completionHandler: completionHandler)
        
        PodApi.shared.polyIn.hasQuads(quads: extendedDataSet) { doesHave in
            if doesHave {
                completionHandler(MessagePackValue(), true)
            } else {
                completionHandler(false, MessagePackValue("Failed"))
            }
        }
    }

    private func extractMatcher(_ matcher: Any) -> ExtendedData? {
        // TODO: Originally, the code expected the matcher to already be of type
        //       ExtendedData. However, with the use cases so far - an empty
        //       matcher - all we get is a dictionary. We need to check whether
        //       that's the intended behaviour - and whether we actually get
        //       a matcher as ExtendedData under any circumstances.
        if let properties = matcher as? [String: Any] {
            return ExtendedData(classname: "unnamed extended data", properties: properties)
        }
        if let extendedData = matcher as? ExtendedData {
            return extendedData
        }
        return nil
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
        
        PodApi.shared.polyOut.fetch(urlString: url, requestInit: fetchRequestInit) { fetchResponse, error in
            if let error = error {
                completionHandler(nil, MessagePackValue(error.localizedDescription))
                return
            }
            guard let fetchResponse = fetchResponse else {
                completionHandler(nil, MessagePackValue(PodApiError.unknown.localizedDescription))
                return
            }
            
            let object = fetchResponse.messagePackObject
            
            let packedData = pack(object)
            
            completionHandler(MessagePackValue(type: 2, data: packedData), nil)
        }
    }
    
    private func handlePolyOutStat(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        
        PodApi.shared.polyOut.stat(path: path) { fileStats, error in
            if let error = error {
                completionHandler(nil, MessagePackValue(error.localizedDescription))
                return
            }
            guard let fileStats = fileStats else {
                completionHandler(nil, MessagePackValue(PodApiError.unknown.localizedDescription))
                return
            }
            let object = fileStats.messagePackObject
            
            let packedData = pack(object)
            
            completionHandler(MessagePackValue(type: 2, data: packedData), nil)
        }
    }
    
    private func handlePolyOutReadFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        
        var options: [String: Any] = [:]
        if args.count > 1 {
            options = args[1] as! [String: Any]
        }
        PodApi.shared.polyOut.fileRead(path: path, options: options) { data, error in
            if let error = error {
                completionHandler(nil, MessagePackValue(error.localizedDescription))
                return
            }
            if let asString = data as? String {
                completionHandler(.string(asString), nil)
                return
            }
            if let asBinary = data as? Data {
                completionHandler(.binary(asBinary), nil)
                return
            }
            completionHandler(nil, MessagePackValue(PodApiError.unknown.localizedDescription))
        }
    }
    
    private func handlePolyOutWriteFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        let data = args[1] as! String
        
        PodApi.shared.polyOut.fileWrite(path: path, data: data) { error in
            if let error = error {
                completionHandler(nil, MessagePackValue(error.localizedDescription))
            } else {
                completionHandler(MessagePackValue(), nil)
            }
        }
    }
}

extension PostOffice {
    private func handlePolyNav(method: String, args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        switch method {
        case "setTitle":
            handlePolyNavSetTitle(args: args)
        case "setActiveActions":
            handlePolyNavSetActiveAction(args: args)
        case "openUrl":
            handlePolyNavOpenUrl(args: args)
        case "pickFile":
            handlePolyNavPickFile(completionHandler: completionHandler)
        default:
            print("PolyNav method unknown:", method)
        }
    }
    
    private func handlePolyNavSetTitle(args: [Any]) {
        let title = args[0] as! String
        PodApi.shared.polyNav.setTitle(title: title) { res, error in
        }
    }

    private func handlePolyNavSetActiveAction(args: [Any]) {
        let actions = args[0] as! [String]
        PodApi.shared.polyNav.setActiveActions(actions: actions) { res, error in
        }
    }

    private func handlePolyNavOpenUrl(args: [Any]) {
        let target = args[0] as! String
        PodApi.shared.polyNav.openUrl(target: target) { res, error in
        }
    }
    
    private func handlePolyNavPickFile(completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        PodApi.shared.polyNav.pickFile() { data in
            if let data = data {
                completionHandler(MessagePackValue(data), nil)
                return
            }
            completionHandler(MessagePackValue(), nil)
        }
    }
}

