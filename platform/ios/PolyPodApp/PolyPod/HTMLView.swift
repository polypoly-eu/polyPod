import SwiftUI
import WebKit

struct HTMLView: UIViewRepresentable {
    private let content: String
    
    init(content: String) {
        self.content = content
    }
    
    init(text: LocalizedStringKey) {
        content = text.toLocalizedString()
    }
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    func makeUIView(context: Context) -> WKWebView {
        let webView = WKWebView()
        webView.navigationDelegate = context.coordinator
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        let header = """
        <header>
            <meta
                name='viewport'
                content='width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no'
            >
        </header>
        """
        webView.loadHTMLString(header + content, baseURL: nil)
    }
    
    class Coordinator: NSObject, WKNavigationDelegate {
        let parent: HTMLView
        
        init(_ parent: HTMLView) {
            self.parent = parent
        }
        
        func webView(
            _ webView: WKWebView,
            decidePolicyFor navigationAction: WKNavigationAction,
            decisionHandler: @escaping (WKNavigationActionPolicy) -> Void
        ) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.cancel)
                return
            }
            
            if navigationAction.navigationType == .linkActivated {
                decisionHandler(.cancel)
                UIApplication.shared.open(url)
                return
            }
            
            decisionHandler(
                url.absoluteString == "about:blank" ? .allow : .cancel
            )
        }
    }
}
