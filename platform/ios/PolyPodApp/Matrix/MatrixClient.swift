// Please remove this line and the empty one after it

import Foundation
import MatrixSDK
import MessagePack

enum MatrixEndpoint: String {
    case login = "https://matrix-client.matrix.org/_matrix/client/r0/login"
    case sync = "https://matrix-client.matrix.org/_matrix/client/r0/sync"
    case roomSendMessage = "https://matrix.org/_matrix/client/r0/rooms/!KcRbmDyIzbIjrqLWTr:matrix.org/send/m.room.message"
}

struct Group: Decodable {
    let id: String
    let messages: [GroupMessage]
}

struct GroupMessage: Decodable, Identifiable {
    var id: TimeInterval {
        timestamp
    }
    let text: String
    let sender: String
    let timestamp: TimeInterval
}
class MatrixClient: ObservableObject {
    
    let homeServerUrl = URL(string: "http://matrix.org")!
    static let instance = MatrixClient()
    @Published var messages: [GroupMessage] = []
    
    var token: String?
    var syncSinceToken: String?
    
    lazy var client = MXRestClient(homeServer: homeServerUrl,
                              unrecognizedCertificateHandler: nil)
    
    func login(_ username: String, _ password: String) {
        guard token == nil else { return }
        let json = """
{
  "type": "m.login.password",
  "password": "\(password)",
  "identifier": {
    "type": "m.id.user",
    "user": "\(username)"
  }
}
"""
        var request = URLRequest(url: URL(string: MatrixEndpoint.login.rawValue)!)
        request.httpMethod = "POST"
        request.httpBody = json.data(using: .utf8)
        
        executeRequest(request) { result in
            switch result {
            case let .success(response):
                self.token = response["access_token"] as? String
                self.sync()
            case let .failure(error):
                print("Failed to login \(error)")
            }
        }
    }
    
    func sendMessage(_ text: String) {
        guard token != nil else { return }
        
        var request = URLRequest(url: URL(string: MatrixEndpoint.roomSendMessage.rawValue)!)
        request.setValue("Bearer \(token!)", forHTTPHeaderField: "Authorization")
        request.httpMethod = "POST"
        request.httpBody = """
{
  "msgtype": "m.text",
  "body": "\(text)"
}
""".data(using: .utf8)
        executeRequest(request) { result in }
    }
    
    func sync() {
        guard token != nil else { return }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
            self.sync()
        }
        
        let url = MatrixEndpoint.sync.rawValue + (syncSinceToken.map { "?since=\($0)" } ?? "")
        var request = URLRequest(url: URL(string: url)!)
        
        request.setValue("Bearer \(token!)", forHTTPHeaderField: "Authorization")
        executeRequest(request) { response in
            switch response {
            case let .success(result):
                self.syncSinceToken = result["next_batch"] as? String
                guard let rooms = result["rooms"] as? [String: Any] else {
                    return
                }
                let joinedRooms = rooms["join"] as! [String: [String: Any]]
                var groups: [Group] = []
                for (roomID, content) in joinedRooms {
                    let timeline = content["timeline"] as! [String: Any]
                    let events = timeline["events"] as! [[String: Any]]
                    var messages: [GroupMessage] = []
                    
                    print("=======================")
                    for event in events {
                        if event["type"] as! String == "m.room.message" {
                            let content = event["content"] as! [String: Any]
                            guard let text = content["body"] as? String else {
                                continue
                            }
                            let sender = event["sender"] as! String
                            let timestamp = event["origin_server_ts"] as! TimeInterval
                            messages.append(GroupMessage(text: text,
                                                         sender: sender.dropFirst().replacingOccurrences(of: ":matrix.org", with: ""),
                                                         timestamp: timestamp))
                            print(text)
                        }
                    }
                    DispatchQueue.main.async(flags: .barrier) {
                        self.messages.append(contentsOf: messages)
                    }
                }
                
            case .failure(_):
                break
            }
        }
    }
    
    private func executeRequest(_ request: URLRequest, _ completion: @escaping (Result<[String : Any], Error>) -> Void) {
        URLSession.shared.dataTask(with: request) { data, response, error in
            completion(Result {
                if let responseError = error {
                    throw responseError
                }
                
                guard let data = data else {
                    throw InvalidDataResult()
                }
                
                return try JSONSerialization.jsonObject(with: data) as! [String : Any]
            })
        }.resume()
    }
}

struct InvalidDataResult: Error {}
