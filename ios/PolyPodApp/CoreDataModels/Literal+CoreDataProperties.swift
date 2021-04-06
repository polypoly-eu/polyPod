//
//  Literal+CoreDataProperties.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 26.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//
//

import Foundation
import CoreData


extension Literal {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<Literal> {
        return NSFetchRequest<Literal>(entityName: "Literal")
    }

    @NSManaged public var language: String
    @NSManaged public var datatype: NamedNode

}
