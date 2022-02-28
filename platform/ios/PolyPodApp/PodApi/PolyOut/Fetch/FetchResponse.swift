import Foundation
import MessagePack

struct FetchResponse {
    let bufferedText: String
    let ok: Bool
    let redirected: Bool
    let status: Int
    let statusText: String
    let type: String
    let url: String
    
    init(response: HTTPURLResponse, data: Data?) {
        if let data = data, let responseString = String(data: data, encoding: .utf8) {
            bufferedText = responseString
        } else {
            bufferedText = ""
        }
        
        ok = true
        redirected = false
        status = response.statusCode
        statusText = "OK"
        type = "basic"
        url = response.url?.absoluteString ?? ""
    }
    
    public var messagePackObject: MessagePackValue {
        var messagePackArray: [MessagePackValue] = []
        
        messagePackArray.append(["bufferedText", .string(bufferedText)])
        messagePackArray.append(["ok", .bool(ok)])
        messagePackArray.append(["redirected", .bool(redirected)])
        messagePackArray.append(["status", .int(Int64(status))])
        messagePackArray.append(["statusText", .string(statusText)])
        messagePackArray.append(["type", .string(type)])
        messagePackArray.append(["url", .string(url)])
        
        let object = MessagePackValue.array(["@polypoly-eu/remote-pod.FetchResponse", .array(messagePackArray)])
        return object
    }
}
