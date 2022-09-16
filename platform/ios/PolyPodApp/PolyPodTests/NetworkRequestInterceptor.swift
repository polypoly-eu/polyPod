import Foundation

/// Interceptor to be used to intercept requests for testing purpose
final class NetworkRequestInterceptor: URLProtocol {
    static var performedRequests = [URLRequest]()

    // MARK: - Stubbing

    private static var _stub: Stub?
    private static var stub: Stub? {
        get { return queue.sync { _stub } }
        set { queue.sync { _stub = newValue } }
    }

    private static let queue = DispatchQueue(label: "URLProtocolStub.queue")

    struct Stub {
        let data: Data?
        let response: URLResponse?
        let error: Error?
        let requestObserver: ((URLRequest) -> Void)?
        
        init(
           data: Data? = nil,
           response: URLResponse? = nil,
           error: Error? = nil,
           requestObserver: ((URLRequest) -> Void)? = nil) {
           self.data = data
           self.response = response
           self.error = error
           self.requestObserver = requestObserver
       }
    }

    static func removeStub() {
        stub = nil
    }

    static func observeRequests(observer: @escaping (URLRequest) -> Void) {
        stub = Stub(data: nil, response: nil, error: nil, requestObserver: observer)
    }

    static func stub(_ stub: Stub) {
        self.stub = stub
    }

    static func stubResponse(data: Data? = nil,
                             response: URLResponse? = nil,
                             error: Error? = nil,
                             observer: @escaping (URLRequest) -> Void = { _ in }) {
        stub = Stub(data: data, response: response, error: error, requestObserver: observer)
    }

    // MARK: - URLProtocol

    override class func canInit(with request: URLRequest) -> Bool {
        performedRequests.append(request)
        return true
    }

    override class func canonicalRequest(for request: URLRequest) -> URLRequest {
        request
    }

    override func startLoading() {
        guard let stub = NetworkRequestInterceptor.stub else {
            client?.urlProtocolDidFinishLoading(self)
            return
        }

        if let data = stub.data {
            self.client?.urlProtocol(self, didLoad: data)
        }

        if let response = stub.response {
            self.client?.urlProtocol(self, didReceive: response, cacheStoragePolicy: .notAllowed)
        }

        if let error = stub.error {
            self.client?.urlProtocol(self, didFailWithError: error)
        } else {
            self.client?.urlProtocolDidFinishLoading(self)
        }

        stub.requestObserver?(self.request)
    }

    override func stopLoading() {}

    // MARK: - Intercept configuration

    static func sessionConfigForIterception() -> URLSessionConfiguration {
        let session = URLSessionConfiguration.ephemeral
        session.requestCachePolicy = .reloadIgnoringLocalAndRemoteCacheData
        session.urlCache = nil
        session.protocolClasses?.insert(NetworkRequestInterceptor.self, at: 0)
        startInterceptingRequests()
        return session
    }

    static func startInterceptingRequests() {
        URLProtocol.registerClass(NetworkRequestInterceptor.self)
    }
}
