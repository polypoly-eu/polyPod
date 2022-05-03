import UIKit
import MessagePack

private func createErrorResponse(_ origin: String, _ message: String) -> MessagePackValue {
    return MessagePackValue("\(origin): \(message)")
}

private func createErrorResponse(_ origin: String, _ error: Error) -> MessagePackValue {
    return createErrorResponse(origin, error.localizedDescription)
}

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
        case "info":
            handleInfo(method: method, completionHandler: { response, error in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        case "endpoint":
            handleEndpoint(method: method, args: args, completionHandler: { response, error in
                self.completeEvent(messageId: messageId, response: response, error: error, completionHandler: completionHandler)
            })
        default:
            Log.error("API unknown: \(api)")
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
        case "match":
            handlePolyInMatch(args: args, completionHandler: completionHandler)
        case "delete":
            handlePolyInDelete(args: args, completionHandler: completionHandler)
        case "has":
            handlePolyInHas(args: args, completionHandler: completionHandler)
        default:
            Log.error("PolyIn method unknown: \(method)")
        }
    }
    
    private func convertArgs(args: [Any]) throws -> [ExtendedData] {
        var extendedDataSet: [ExtendedData] = []
        
        for arg in args {
            guard let extendedData = arg as? ExtendedData else {
                Log.error("""
                    Bad argument data: \(arg)
                    \(Thread.callStackSymbols.joined(separator: "\n"))
                """)
                throw PodApiError.badArgumentData(arg)
            }
            
            let graph = extendedData.properties["graph"] as? ExtendedData
            let graphType = graph?.classname
            if (graphType != "@polypoly-eu/rdf.DefaultGraph") {
                throw PodApiError.failedToReadGraph(graphType ?? "<missing>")
            }
            
            extendedDataSet.append(extendedData)
        }
        return extendedDataSet
    }
    
    private func handlePolyInAdd(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let extendedDataSet: [ExtendedData]
        do {
            extendedDataSet = try convertArgs(args: args)
        } catch {
            completionHandler(nil, createErrorResponse(#function, error))
            return
        }
        
        PodApi.shared.polyIn.addQuads(quads: extendedDataSet) { error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
                return
            }
            completionHandler(MessagePackValue(), nil)
        }
    }
    
    private func handlePolyInMatch(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        guard let extendedData = extractMatcher(args[0]) else {
            completionHandler(nil, createErrorResponse(#function, PodApiError.badData(args[0])))
            return
        }
        PodApi.shared.polyIn.matchQuads(matcher: extendedData) { quads, error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
                return
            }
            
            guard let quads = quads else {
                completionHandler(nil, createErrorResponse(#function, PodApiError.unknown))
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
        let extendedDataSet: [ExtendedData]
        do {
            extendedDataSet = try convertArgs(args: args)
        } catch {
            completionHandler(nil, createErrorResponse(#function, error))
            return
        }
        
        PodApi.shared.polyIn.deleteQuads(quads: extendedDataSet) { error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
                return
            }
            completionHandler(MessagePackValue(), nil)
        }
    }
    
    private func handlePolyInHas(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let extendedDataSet: [ExtendedData]
        do {
            extendedDataSet = try convertArgs(args: args)
        } catch {
            completionHandler(nil, createErrorResponse(#function, error))
            return
        }
        
        PodApi.shared.polyIn.hasQuads(quads: extendedDataSet) { doesHave in
            if doesHave {
                completionHandler(MessagePackValue(true), nil)
            } else {
                completionHandler(MessagePackValue(false), nil)
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
        case "readDir":
            handlePolyOutReadDir(args: args, completionHandler: completionHandler)
        case "importArchive":
            handlePolyOutImportArchive(args: args, completionHandler: completionHandler)
        case "removeArchive":
            handlePolyOutRemoveArchive(args: args, completionHandler: completionHandler)
        default:
            Log.error("PolyOut method unknown: \(method)")
        }
    }
    
    private func handlePolyOutFetch(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let url = args[0] as! String
        let requestInitData = args[1] as! [String: Any]
        
        let fetchRequestInit = FetchRequestInit(with: requestInitData)
        
        PodApi.shared.polyOut.fetch(urlString: url, requestInit: fetchRequestInit) { fetchResponse, error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
                return
            }
            guard let fetchResponse = fetchResponse else {
                completionHandler(nil, createErrorResponse(#function, PodApiError.unknown))
                return
            }
            
            let object = fetchResponse.messagePackObject
            
            let packedData = pack(object)
            
            completionHandler(MessagePackValue(type: 2, data: packedData), nil)
        }
    }
    
    private func handlePolyOutStat(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        
        PodApi.shared.polyOut.stat(url: path) { fileStats, error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
                return
            }
            guard let fileStats = fileStats else {
                completionHandler(nil, createErrorResponse(#function, PodApiError.unknown))
                return
            }
            let object = fileStats.messagePackObject
            
            let packedData = pack(object)
            
            completionHandler(MessagePackValue(type: 2, data: packedData), nil)
        }
    }
    
    private func handlePolyOutReadFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as? String ?? ""
        
        var options: [String: Any] = [:]
        if args.count > 1 {
            options = args[1] as! [String: Any]
        }
        PodApi.shared.polyOut.fileRead(url: path, options: options) { data, error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
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
            completionHandler(nil, createErrorResponse(#function, PodApiError.unknown))
        }
    }
    
    private func handlePolyOutWriteFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        let data = args[1] as! String
        
        PodApi.shared.polyOut.fileWrite(url: path, data: data) { error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
            } else {
                completionHandler(MessagePackValue(), nil)
            }
        }
    }
    
    private func handlePolyOutReadDir(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let path = args[0] as! String
        
        PodApi.shared.polyOut.readDir(url: path) { fileList, error in
            if let error = error {
                completionHandler(nil, createErrorResponse(#function, error))
            } else {
                var encodedList: [MessagePackValue] = []
                for file in fileList ?? [] {
                    var entry = [MessagePackValue: MessagePackValue]()
                    ["id", "path"].forEach { key in
                        entry[.string(key)] = .string(file[key] ?? "")
                    }
                    encodedList.append(MessagePackValue.map(entry))
                }
                completionHandler(MessagePackValue(encodedList), nil)
            }
        }
    }
    
    private func handlePolyOutImportArchive(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let url = args[0] as! String
        PodApi.shared.polyOut.importArchive(url: url) { fileId in
            if let fileId = fileId {
                completionHandler(MessagePackValue(fileId), nil)
                return
            }
            completionHandler(MessagePackValue(), nil)
        }
    }
    
    private func handlePolyOutRemoveArchive(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let fileId = args[0] as! String
        PodApi.shared.polyOut.removeArchive(fileId: fileId) { error in
            completionHandler(MessagePackValue(), nil)
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
            handlePolyNavPickFile(args: args, completionHandler: completionHandler)
        default:
            Log.error("PolyNav method unknown: \(method)")
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
    
    private func handlePolyNavPickFile(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        let type = args[0] as? String
        PodApi.shared.polyNav.pickFile(type: type) { externalFile in
            completionHandler(externalFile == nil ? nil : externalFile?.messagePackObject, nil)
        }
    }
}

extension PostOffice {
    private func handleInfo(method: String, completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        switch method {
        case "getRuntime":
            handleInfoGetRuntime(completionHandler: completionHandler)
        case "getVersion":
            handleInfoGetVersion(completionHandler: completionHandler)
        default:
            Log.error("Info method unknown: \(method)")
        }
    }
    
    private func handleInfoGetRuntime(completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        completionHandler(.string(PodApi.shared.info.getRuntime()), nil)
    }
    
    private func handleInfoGetVersion(completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        completionHandler(.string(PodApi.shared.info.getVersion()), nil)
    }
}

extension PostOffice {
    private func handleEndpoint(method: String, args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void){
        switch method {
        case "send":
            handleEndpointSend(args: args, completionHandler: completionHandler)
        case "get":
            handleEndpointGet(args: args, completionHandler: completionHandler)
        default: Log.error("Endpoint method unknown: \(method)")
        }
    }
    
    private func handleEndpointSend(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        guard let endpointId = args[0] as? String else {
            completionHandler(nil, createErrorResponse(#function, PodApiError.badArgumentType(args[0], type: "String")))
            return
        }
        guard let payload = args[1] as? String else {
            completionHandler(nil, createErrorResponse(#function, PodApiError.badArgumentType(args[1], type: "String")))
            return
        }
        let contentType = args[2] as? String
        let authToken = args[3] as? String
        PodApi.shared.endpoint.send(endpointId: endpointId, payload: payload, contentType: contentType, authToken: authToken) { error in
            completionHandler(.nil, error == nil ? nil : createErrorResponse(#function, error!))
        }
    }
    
    private func handleEndpointGet(args: [Any], completionHandler: @escaping (MessagePackValue?, MessagePackValue?) -> Void) {
        guard let endpointId = args[0] as? String else {
            completionHandler(nil, createErrorResponse(#function, PodApiError.badArgumentType(args[0], type: "String")))
            return
        }
        let contentType = args[1] as? String
        let authToken = args[2] as? String
        PodApi.shared.endpoint.get(endpointId: endpointId, contentType: contentType, authToken: authToken) { data, error in
            if (error == nil) {
                completionHandler(data.map(MessagePackValue.string), nil)
                return
            }
            completionHandler(nil, createErrorResponse(#function, error!))
        }
    }
}
