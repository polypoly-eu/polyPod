//
//  PolyIn.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyIn {
    
    func addQuads(quads: [[String: Any]]) {
        let success = try? JSONSerialization.save(jsonObject: quads, toFilename: "quads")
        print("added quads: ", success ?? "failed")
    }
    
    func selectQuads(matcher: [[String: Any]]?) -> Any? {
        let storedQuads = try? JSONSerialization.loadJSON(withFilename: "quads") as? [[String : Any]]
        return storedQuads
    }
}
