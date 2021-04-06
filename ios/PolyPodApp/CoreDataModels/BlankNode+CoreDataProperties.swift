//
//  BlankNode+CoreDataProperties.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 26.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//
//

import Foundation
import CoreData


extension BlankNode {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<BlankNode> {
        return NSFetchRequest<BlankNode>(entityName: "BlankNode")
    }


}
