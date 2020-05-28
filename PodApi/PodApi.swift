//
//  PodApi.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 01.04.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PodApi {

    static let  shared = PodApi()
    
    lazy var preferences: Preferences  = {
        return Preferences()
    }()
    
    lazy var polyIn: PolyIn  = {
        return PolyIn()
    }()
    
    lazy var polyOut: PolyOut  = {
        return PolyOut()
    }()
}
