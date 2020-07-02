//
//  Term+CoreDataProperties.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 26.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//
//

import Foundation
import CoreData


extension Term {

    @nonobjc public class func fetchRequest() -> NSFetchRequest<Term> {
        return NSFetchRequest<Term>(entityName: "Term")
    }

    @NSManaged public var termType: String?
    @NSManaged public var value: String?

}
