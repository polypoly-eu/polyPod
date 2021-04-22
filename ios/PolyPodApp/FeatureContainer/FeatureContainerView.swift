import SwiftUI
import WebKit

struct FeatureContainerView: UIViewRepresentable {
    let feature: Feature
    @Binding var title: String
    @Binding var activeActions: [String]
    var queuedAction: (String, DispatchTime)?
    let openUrlHandler: (String) -> Void
    
    func makeUIView(context: Context) -> FeatureWebView {
        let featureWebView = FeatureWebView(
            feature: feature,
            title: $title,
            activeActions: $activeActions,
            openUrlHandler: openUrlHandler
        )
        
        if let featureColor = feature.primaryColor {
            featureWebView.backgroundColor = UIColor(featureColor)
            featureWebView.isOpaque = false
        }
        
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

class FeatureWebView: WKWebView {
    private let featureTitle: Binding<String>
    private let activeActions: Binding<[String]>
    private let openUrlHandler: (String) -> Void
    private var lastActionDispatch: DispatchTime = DispatchTime.now()
    
    init(
        feature: Feature,
        title: Binding<String>,
        activeActions: Binding<[String]>,
        openUrlHandler: @escaping (String) -> Void
    ) {
        self.featureTitle = title
        self.activeActions = activeActions
        self.openUrlHandler = openUrlHandler
        
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
        installUserScript(contentController, "podNav", forMainFrameOnly: false)
        
        // The original idea was that the feature explicitly loads pod.js, but
        // in order to still support the polyfill-based development approach,
        // we explicitly inject it, at least for now.
        installUserScript(contentController, "pod", forMainFrameOnly: false)
        
        let configuration = WKWebViewConfiguration()
        configuration.userContentController = contentController
        
        super.init(frame: .zero, configuration: configuration)
        scrollView.isScrollEnabled = false
        translatesAutoresizingMaskIntoConstraints = false
        MessageName.allCases.forEach {
            contentController.add(self, name: $0.rawValue)
        }
        
        let featureUrl = feature.path
        let featureFileUrl = featureUrl.appendingPathComponent("pod.html")
        loadFileURL(featureFileUrl, allowingReadAccessTo: featureUrl)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
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
            command: 'triggerPodNavAction',
            action: '\(action)'
        }, '*')
        """
        evaluateJavaScript(script) { (_, error) in
            if error != nil {
                print(
                    """
                    Failed to trigger podNav action '\(action)': \
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
            case .PodNav:
                // We should probably use an event message for this instead,
                // rather than a custom new one.
                self.doHandlePodNavCommand(messageBody: body)
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
                                print(
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
            print("Error: WebView sent bad log message")
            return
        }
        
        print("WebView: " + text)
    }
    
    private func doHandlePodNavCommand(messageBody: [String: Any]) {
        guard let messageText = messageBody["text"] as? String else {
            print(
                """
                Error: Bad podNav message - \
                missing/unexpected message text: \(messageBody)
                """
            )
            return
        }
        
        let textData = messageText.data(using: .utf8)!
        guard let jsonData =
                try? JSONSerialization.jsonObject(with: textData, options: [])
                as? [String: Any]
        else {
            print(
                """
                Error: Bad podNav command message - \
                invalid JSON data: \(messageBody)
                """
            )
            return
        }
        
        guard let commandName = jsonData["name"] as? String
        else {
            print(
                """
                Error: Bad podNav command message - \
                missing/unexpected command name: \(jsonData)
                """
            )
            return
        }
        
        let commandData = jsonData["data"]
        switch (commandName) {
        case "setTitle":
            guard let title = commandData as? String else {
                print(
                    """
                    Error: Bad podNav setTitle command data: \
                    \(String(describing: commandData))
                    """
                )
                break
            }
            featureTitle.wrappedValue = title
        case "setActiveActions":
            guard let actions = commandData as? [String] else {
                print(
                    """
                    Error: Bad podNav setActiveActions command data: \
                    \(String(describing: commandData))
                    """
                )
                break
            }
            activeActions.wrappedValue = actions
        case "openUrl":
            guard let target = commandData as? String else {
                print(
                    """
                    Error: Bad podNav openUrl command data: \
                    \(String(describing: commandData))
                    """
                )
                break
            }
            openUrlHandler(target)
        default:
            print(
                """
                Error: Bad podNav command message - \
                unknown command '\(commandName)'
                """
            )
        }
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
