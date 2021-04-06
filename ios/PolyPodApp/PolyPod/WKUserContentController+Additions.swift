//
//  WKUserContentController+Additions.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 11.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import WebKit

extension WKUserContentController {
    
    func installUserScript(_ filename: String, forMainFrameOnly: Bool = false) {
        guard let filePath = Bundle.main.path(forResource: filename, ofType: "js") else { return }
        guard let contents = try? String(contentsOfFile: filePath) else { return }
        let userScript = WKUserScript(source: contents, injectionTime: WKUserScriptInjectionTime.atDocumentStart, forMainFrameOnly: forMainFrameOnly)
        self.addUserScript(userScript)
    }
    
}
