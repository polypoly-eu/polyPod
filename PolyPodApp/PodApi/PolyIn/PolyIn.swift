//
//  PolyIn.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

protocol PolyInProtocol {
    func addQuads(quads: [ExtendedData], completionHandler: (Bool) -> Void)
    func selectQuads(matcher: ExtendedData, completionHandler: ([ExtendedData]?, Error?) -> Void)
}

class PolyIn: PolyInProtocol {
    
}
