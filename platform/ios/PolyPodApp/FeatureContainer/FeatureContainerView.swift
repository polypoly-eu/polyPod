import SwiftUI
import WebKit

struct FeatureContainerView: UIViewRepresentable {
    let feature: Feature
    @Binding var title: String
    @Binding var activeActions: [String]
    var queuedAction: (String, DispatchTime)?
    let errorHandler: (String) -> Void
    let openUrlHandler: (String) -> Void
    let pickFileHandler: (String?, @escaping (ExternalFile?) -> Void) -> Void

    func makeUIView(context: Context) -> FeatureWebView {
        let featureWebView = FeatureWebView(
            feature: feature,
            title: $title,
            activeActions: $activeActions,
            errorHandler: errorHandler,
            openUrlHandler: openUrlHandler,
            pickFileHandler: pickFileHandler
        )

        if let featureColor = feature.primaryColor {
            featureWebView.backgroundColor = UIColor.compatInit(featureColor)
            featureWebView.isOpaque = false
        }

        PodApi.shared.polyNav.delegate  = featureWebView

        return featureWebView
    }

    func updateUIView(_ uiView: FeatureWebView, context: Context) {
        guard let (action, dispatchTime) = queuedAction else {
            return
        }

        // For some reason, activeActions is empty within the view, so we
        // need to check it here.
        if !activeActions.contains(action) {
            return
        }
        
        uiView.triggerAction(action: action, dispatchTime: dispatchTime)
    }
}

class FeatureFileHandler: UIViewController, WKURLSchemeHandler {
    private var feature: Feature? = nil
    func setFeature(feature: Feature) {
        self.feature = feature
    }
    
    func mimeTypeFromExt(ext: String) -> String {
        switch ext {
        case "html":
            return "text/html"
        case "js":
            return "application/javascript"
        case "css":
            return "text/css"
        case "svg":
            return "image/svg+xml"
        case "json":
            return "application/json"
        case "woff2":
            return "font/woff2"
        default:
            return "application/octet-stream"
        }
    }
    
    func webView(_ webView: WKWebView, start urlSchemeTask: WKURLSchemeTask) {
        guard let url = urlSchemeTask.request.url,
            let scheme = url.scheme,
            scheme == PolyOut.fsProtocol.lowercased() else {
            urlSchemeTask.didFailWithError(PolyNavError.protocolError(""))
                return
        }
        
        let urlString = url.absoluteString
        let index = urlString.index(urlString.startIndex, offsetBy: PolyOut.fsPrefix.count)
        let file = String(urlString[index..<urlString.endIndex]).trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        let ext = (file as NSString).pathExtension
                        
        do {
            var fileData: Data? = nil
            if (file.starts(with: PolyOut.fsFilesRoot)) {
                let options: [String: Any] = [:]
                PodApi.shared.polyOut.fileRead(
                    url: urlString,
                    options: options,
                    completionHandler: { data, error in
                        fileData = data as? Data
                    }
                )
            }
            else {
                var targetUrl = feature?.path
                targetUrl = targetUrl?.appendingPathComponent(file)

                fileData = try Data(contentsOf: targetUrl!)
            }
            let headers: [String : String] = [
                "Access-Control-Allow-Origin": PolyOut.fsPrefix,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "*",
                "Content-Length": String(fileData?.count ?? 0),
                "Content-Type": mimeTypeFromExt(ext: ext)
            ]
            
            let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP 1.0", headerFields: headers)
            
            // Fulfill the task.
            urlSchemeTask.didReceive(response!)
            urlSchemeTask.didReceive(fileData ?? Data())
            urlSchemeTask.didFinish()
        } catch {
            urlSchemeTask.didFailWithError(error)
        }
    }
    
    func webView(_ webView: WKWebView, stop urlSchemeTask: WKURLSchemeTask) {
        
    }
}

class FeatureWebView: WKWebView {
    private let featureTitle: Binding<String>
    private let activeActions: Binding<[String]>
    private let errorHandler: (String) -> Void
    private let openUrlHandler: (String) -> Void
    private let pickFileHandler: (String?, @escaping (ExternalFile?) -> Void) -> Void
    private var lastActionDispatch: DispatchTime = DispatchTime.now()

    init(
        feature: Feature,
        title: Binding<String>,
        activeActions: Binding<[String]>,
        errorHandler: @escaping (String) -> Void,
        openUrlHandler: @escaping (String) -> Void,
        pickFileHandler: @escaping (String?, @escaping (ExternalFile?) -> Void) -> Void
    ) {
        PodApi.shared.polyOut.activeFeature = feature
        
        self.featureTitle = title
        self.activeActions = activeActions
        self.errorHandler = errorHandler
        self.openUrlHandler = openUrlHandler
        self.pickFileHandler = pickFileHandler

        let contentController = WKUserContentController();
        installUserScript(
            contentController,
            "messagePort",
            forMainFrameOnly: true
        )
        installUserScript(
            contentController,
            "domConsole",
            forMainFrameOnly: false
        )

        installUserScript(contentController, "polyNav", forMainFrameOnly: false)
        
        installUserScript(
            contentController,
            "disableUserSelect",
            forMainFrameOnly: false
        )
        
        installUserScript(
            contentController,
            "handleErrors",
            forMainFrameOnly: false
        )

        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController

        let scheme = PolyOut.fsProtocol
        let fileHandler = FeatureFileHandler()
        fileHandler.setFeature(feature: feature)
        configuration.setURLSchemeHandler(fileHandler, forURLScheme: scheme)

        super.init(frame: .zero, configuration: configuration)

        scrollView.isScrollEnabled = false
        translatesAutoresizingMaskIntoConstraints = false
        MessageName.allCases.forEach {
            contentController.add(self, name: $0.rawValue)
        }
        removeInputAccessory()

        var components = URLComponents()
        components.scheme = scheme
        components.path = "/pod.html"
        components.host = ""
        load(URLRequest(url: components.url!))
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func removeInputAccessory() {
        // WKWebView, as of April 2021, has an odd input accessory view for the
        // keyboard that contains up and down buttons, as well as a "done"
        // button. It looks like it's meant for find in page functionality.
        // As a side effect, it also causes scary UI constraint errors when the
        // keyboard pops up, that seem to be caused by a bug in iOS.
        // Since we don't want the thing, nor the errors, we remove it.
        // This is the best approach we could find :/

        guard let target = scrollView.subviews.first(where: {
            String(describing: type(of: $0)).starts(with: "WKContent")
        }) else { return }

        guard let noInputAccessoryClass = createNoInputAccessoryClass(target)
        else { return }

        class NoInputAccessoryHelper: NSObject {
            @objc var inputAccessoryView: AnyObject? { return nil }
        }

        guard let original = class_getInstanceMethod(
            NoInputAccessoryHelper.self,
            #selector(getter: NoInputAccessoryHelper.inputAccessoryView)
        ) else { return }

        class_addMethod(
            noInputAccessoryClass.self,
            #selector(getter: NoInputAccessoryHelper.inputAccessoryView),
            method_getImplementation(original),
            method_getTypeEncoding(original)
        )

        object_setClass(target, noInputAccessoryClass)
    }

    func triggerAction(action: String, dispatchTime: DispatchTime) {
        // Invoking behaviour in the WKWebView, which keeps its own state, is
        // surprisingly difficult in Swift UI. This odd workaround is the best
        // we could come up with.
        if lastActionDispatch >= dispatchTime {
            return
        }
        lastActionDispatch = dispatchTime

        // There is already a mechanism for sending messages to the feature's
        // iframe, we should use that here instead of opening up a new channel.
        let script = """
        document.getElementById('harness').contentWindow.postMessage({
            command: 'triggerPolyNavAction',
            action: '\(action)'
        }, '*')
        """
        evaluateJavaScript(script) { (_, error) in
            if error != nil {
                Log.error(
                    """
                    Failed to trigger polyNav action '\(action)': \
                    \(String(describing: error))
                    """
                )
            }
        }
    }
}

extension FeatureWebView: WKScriptMessageHandler {
    func userContentController(
        _ userContentController: WKUserContentController,
        didReceive message: WKScriptMessage
    ) {
        guard let messageName = MessageName(rawValue: message.name) else {
            return
        }

        DispatchQueue.main.async { [weak self] in
            guard let self = self else { return }
            guard let body = message.body as? [String: Any] else { return }

            switch messageName {
            case .Log:
                self.doLog(data: body)
            case .Event:
                self.doHandleEvent(messageBody: body)
            case .Error:
                self.doLogError(body)
            }
        }
    }

    private func doHandleEvent(messageBody: [String: Any]) {
        PostOffice.shared.handleIncomingEvent(
            eventData: messageBody,
            completionHandler: { responseData in
                DispatchQueue.main.async { [weak self] in
                    let jsExpression = "port1.postMessage(\(responseData));"
                    self?.evaluateJavaScript(
                        jsExpression,
                        completionHandler: { result, error in
                            if error != nil {
                                Log.error(
                                    """
                                    Received an error from JavaScript: \
                                    \(error!)
                                    """
                                )
                            }
                        }
                    )
                }
            }
        )
    }

    private func doLog(data: [String: Any]) {
        guard let text = data["text"] as? String else {
            Log.error("WebView sent bad log message")
            return
        }

        Log.info("Message from FeatureContainer: \(text)")
    }
    
    private func doLogError(_ error: [String: Any]) {
        let message = error["message"] as? String ?? "Unknown"
        Log.error("Error from FeatureContainer: \(message)")
        errorHandler(message)
    }
}

extension FeatureWebView: PolyNavDelegate {
    func doHandleSetTitle(title: String) {
        featureTitle.wrappedValue = title
    }

    func doHandleSetActiveActions(actions: [String]) {
        activeActions.wrappedValue = actions
    }
    
    func doHandleOpenUrl(url: String) {
        openUrlHandler(url)
    }
    
    func doHandlePickFile(type: String?, completion: @escaping (ExternalFile?) -> Void) {
        pickFileHandler(type, completion)
    }
}

func installUserScript(
    _ contentController: WKUserContentController,
    _ filename: String,
    forMainFrameOnly: Bool = false
) {
    guard let filePath =
            Bundle.main.path(forResource: filename, ofType: "js")
    else { return }

    guard let contents = try? String(contentsOfFile: filePath) else { return }
    let userScript = WKUserScript(
        source: contents,
        injectionTime: WKUserScriptInjectionTime.atDocumentStart,
        forMainFrameOnly: forMainFrameOnly
    )
    contentController.addUserScript(userScript)
}

private func createNoInputAccessoryClass(_ target: UIView) -> AnyClass? {
    guard let superclass = target.superclass else { return nil }
    let className = "\(superclass)_NoInputAccessory"
    let existingClass: AnyClass? = NSClassFromString(className)
    if existingClass != nil {
        return existingClass
    }

    guard let targetClass = object_getClass(target) else { return nil }
    guard let classNameCString = className.cString(using: .ascii) else {
        return nil
    }
    guard let newClass =
            objc_allocateClassPair(targetClass, classNameCString, 0)
    else { return nil }
    objc_registerClassPair(newClass)
    return newClass
}
