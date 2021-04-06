//
//  Term+Additions.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 17.07.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

extension Term {
    
    @objc func matches(other: Term) -> Bool {
        return self.termType == other.termType && self.value == other.value
    }
    
}
