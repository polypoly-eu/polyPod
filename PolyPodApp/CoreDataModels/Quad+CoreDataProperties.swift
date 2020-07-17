//
//  Quad+CoreDataProperties.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 26.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//
//

import Foundation
import CoreData


extension Quad {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<Quad> {
        return NSFetchRequest<Quad>(entityName: "Quad")
    }

    @NSManaged public var subject: Term
    @NSManaged public var predicate: Term
    @NSManaged public var object: Term
    @NSManaged public var graph: Term

}
