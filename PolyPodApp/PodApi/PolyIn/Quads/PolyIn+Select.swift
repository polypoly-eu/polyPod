//
//  PolyIn+Select.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 17.07.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit
import CoreData

extension PolyIn {
    
    func selectQuads(matcher: ExtendedData, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil, PolyApiError.databaseError)
            return
        }
        
        let managedContext = appDelegate.persistentContainer.viewContext
        
        let (predicate, filterOperation) = quadsPredicateAndFilter(matcher: matcher)
        
        do {
            let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
            fetchRequest.predicate = predicate
            var quads = try managedContext.fetch(fetchRequest)
            
            if let filterOperation = filterOperation {
                quads = quads.filter(filterOperation)
            }
            
            let result = extendedData(from: quads)
            completionHandler(result, nil)
        } catch {
            completionHandler(nil, error)
        }
    }
    
    private func quadsPredicateAndFilter(matcher: ExtendedData) -> (NSPredicate, ((Quad) -> Bool)?) {
        var formatItems: [String] = []
        var arguments: [Any] = []

        if let subjectsMatcher = matcher.properties["subject"] as? ExtendedData {
            formatItems.append("subject.termType == %@ && subject.value == %@")
            arguments.append(subjectsMatcher.properties["termType"] as! String)
            arguments.append(subjectsMatcher.properties["value"] as! String)
        }
        if let predicatesMatcher = matcher.properties["predicate"] as? ExtendedData {
            formatItems.append("predicate.termType == %@ && predicate.value == %@")
            arguments.append(predicatesMatcher.properties["termType"] as! String)
            arguments.append(predicatesMatcher.properties["value"] as! String)
        }
        var filterOperation: ((Quad) -> Bool)? = nil
        if let objectsMatcher = matcher.properties["object"] as? ExtendedData {
            let termType = objectsMatcher.properties["termType"] as! String
            if termType == "Literal" {
                let language = objectsMatcher.properties["language"] as! String
                let datatype = objectsMatcher.properties["datatype"] as! ExtendedData
                let termType = datatype.properties["termType"] as! String
                let value = datatype.properties["value"] as! String
                filterOperation = { (quad: Quad) -> Bool in
                        let literal = quad.object as! Literal
                        if literal.language == language && literal.datatype.termType == termType && literal.datatype.value == value {
                            return true
                        }
                        return false
                    
                }
            }
            formatItems.append("object.termType == %@ && object.value == %@")
            arguments.append(termType)
            arguments.append(objectsMatcher.properties["value"] as! String)
        }
            
        var format:String = ""
        for (i, formatItem) in formatItems.enumerated() {
            if i != 0 {
                format += " && "
            }
            format += formatItem
        }
        
        let predicate = NSPredicate(format: format, argumentArray: arguments)
        return (predicate, filterOperation)
    }
    
    private func extendedData(from quads: [Quad]) -> [ExtendedData] {
        var result: [ExtendedData] = []
        
        for (index, quad) in quads.enumerated() {
            var isDuplicate = false
            for otherIndex in index+1..<quads.count {
                let otherQuad = quads[otherIndex]
                if otherQuad.matches(other: quad) {
                    isDuplicate = true
                    break
                }
            }
            if !isDuplicate {
                let extendedData = createExtendedData(for: quad)
                result.append(extendedData)
            }
        }
        
        return result
    }
    
    private func createExtendedData(for managedObject: NSManagedObject) -> ExtendedData {
        let classname = "@polypoly-eu/rdf." + String(describing: type(of: managedObject))
        let attributes = managedObject.entity.attributesByName
        let relationships = managedObject.entity.relationshipsByName
        var properties: [String: Any] = [:]
        for (attribute, _) in attributes {
            if let value = managedObject.value(forKey: attribute) {
                properties[attribute] = value
            }
        }
        for (relationship, _) in relationships {
            if let value = managedObject.value(forKey: relationship) as? NSManagedObject {
                properties[relationship] = createExtendedData(for: value)
            }
        }
        let extendedData = ExtendedData(classname: classname, properties: properties)
        return extendedData
    }
    
}
