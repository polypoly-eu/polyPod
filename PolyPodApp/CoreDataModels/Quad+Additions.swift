//
//  Quad+Additions.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 17.07.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

extension Quad {
    
    func matches(other: Quad) -> Bool {
        if !self.graph.matches(other: other.graph) {
            return false
        }
        if !self.subject.matches(other: other.subject) {
            return false
        }
        if !self.predicate.matches(other: other.predicate) {
            return false
        }
        if !self.object.matches(other: other.object) {
            return false
        }
        return true
    }
    
}
