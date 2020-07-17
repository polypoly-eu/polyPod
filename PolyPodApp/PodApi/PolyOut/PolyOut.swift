//
//  PolyOut.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class PolyOut {
    
    let session: NetworkSession
    let fileStoragePath: URL
    
    init(session: NetworkSession = URLSession.shared) {
        self.session = session
        
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        fileStoragePath = paths[0]
    }
    
}
