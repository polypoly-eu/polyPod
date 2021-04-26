// Accessing window.parent leads to a script error in WKWebView. On other
// platforms, however, we have some use cases for doing this, so we simply
// make features feel like top level frames on iOS.
if (window.parent !== window.self) window.parent = window.self;
