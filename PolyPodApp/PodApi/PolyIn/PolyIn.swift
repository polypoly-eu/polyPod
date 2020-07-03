//
//  PolyIn.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import UIKit
import CoreData

class PolyIn {
    
    func addQuads(quads: [ExtendedData], completionHandler: (Bool) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(false)
            return
        }
        
        let managedContext = appDelegate.persistentContainer.viewContext
        
        for quad in quads {
            let _ = createNode(for: quad, in: managedContext)
        }
        
        do {
            try managedContext.save()
            completionHandler(true)
        } catch {
            print("Could not save. \(error)")
            completionHandler(false)
        }
    }

    func selectQuads(matcher: ExtendedData, completionHandler: ([ExtendedData]?, Error?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil, PolyApiError.databaseError)
            return
        }
        
        let managedContext = appDelegate.persistentContainer.viewContext
        
        do {
            var subjects: [Term]?
            if let subjectsMatcher = matcher.properties["subject"] as? ExtendedData {
                subjects = try fetchSubjects(subjectsMatcher: subjectsMatcher, in: managedContext)
            }
            var predicates: [Term]?
            if let predicatesMatcher = matcher.properties["predicate"] as? ExtendedData {
                predicates = try fetchPredicates(predicatesMatcher: predicatesMatcher, in: managedContext)
            }
            var objects: [Term]?
            if let objectsMatcher = matcher.properties["object"] as? ExtendedData {
                objects = try fetchObjects(objectsMatcher: objectsMatcher, in: managedContext)
            }
            
            let fetchRequest: NSFetchRequest<Quad> = quadsFetchRequest(subjects: subjects, predicates: predicates, objects: objects)
            let quads = try managedContext.fetch(fetchRequest)
            var result: [ExtendedData] = []
            for quad in quads {
                let extendedData = createExtendedData(for: quad)
                result.append(extendedData)
            }
            completionHandler(result, nil)
        } catch {
            completionHandler(nil, error)
        }
    }
    
    private func createNode(for extendedData: ExtendedData, in managedContext: NSManagedObjectContext) -> NSManagedObject? {
        let entityName = extendedData.classname.replacingOccurrences(of: "@polypoly-eu/rdf.", with: "")

        guard let entity = NSEntityDescription.entity(forEntityName: entityName, in: managedContext) else {
            assert(false)
        }
        
        let node = NSManagedObject(entity: entity, insertInto: managedContext)
         
        for (key, value) in extendedData.properties {
            if let childExtendedData = value as? ExtendedData {
                let childNode = createNode(for: childExtendedData, in: managedContext)
                node.setValue(childNode, forKey: key)
            } else {
                node.setValue(value, forKeyPath: key)
            }
        }
        
        return node
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
    
    private func quadsFetchRequest(subjects: [Term]?, predicates: [Term]?, objects: [Term]?) -> NSFetchRequest<Quad> {
        let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
        var formatItems: [String] = []
        var arguments: [Any] = []

        if let subjects = subjects {
            formatItems.append("subject IN %@")
            arguments.append(subjects)
        }
        if let predicates = predicates {
            formatItems.append("predicate IN %@")
            arguments.append(predicates)
        }
        if let objects = objects {
            formatItems.append("object IN %@")
            arguments.append(objects)
        }
        
        var format:String = ""
        for (i, formatItem) in formatItems.enumerated() {
            if i != 0 {
                format += " && "
            }
            format += formatItem
        }
        
        fetchRequest.predicate = NSPredicate(format: format, argumentArray: arguments)
        return fetchRequest
    }
    
    private func fetchSubjects(subjectsMatcher: ExtendedData, in managedContext: NSManagedObjectContext) throws -> [Term] {
        guard let termType = subjectsMatcher.properties["termType"] as? String, let value = subjectsMatcher.properties["value"] as? String else {
            throw PolyApiError.badSearchQuery
        }
        let fetchRequest: NSFetchRequest<Term> = Term.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "termType == %@ && value == %@", termType, value)
        let subjects: [Term] = try managedContext.fetch(fetchRequest)
        return subjects
    }
    
    private func fetchPredicates(predicatesMatcher: ExtendedData, in managedContext: NSManagedObjectContext) throws -> [Term] {
        guard let termType = predicatesMatcher.properties["termType"] as? String, let value = predicatesMatcher.properties["value"] as? String else {
            throw PolyApiError.badSearchQuery
        }
        let fetchRequest: NSFetchRequest<Term> = Term.fetchRequest()
        fetchRequest.predicate = NSPredicate(format: "termType == %@ && value == %@", termType, value)
        let predicates: [Term] = try managedContext.fetch(fetchRequest)
        return predicates
    }
    
    private func fetchObjects(objectsMatcher: ExtendedData, in managedContext: NSManagedObjectContext) throws -> [Term] {
        guard let termType = objectsMatcher.properties["termType"] as? String, let value = objectsMatcher.properties["value"] as? String else {
            throw PolyApiError.badSearchQuery
        }
        if termType == "Literal" {
            guard let language = objectsMatcher.properties["language"] as? String, let datatype = objectsMatcher.properties["datatype"] as? ExtendedData else {
                throw PolyApiError.badSearchQuery
            }
            let fetchRequest: NSFetchRequest<Literal> = Literal.fetchRequest()
            fetchRequest.predicate = NSPredicate(format: "termType == %@ && value == %@ && language == %@ && datatype.termType == %@ && datatype.value == %@", termType, value, language, datatype.properties["termType"] as! String, datatype.properties["value"] as! String)
            let objects: [Literal] = try managedContext.fetch(fetchRequest)
            return objects
        } else {
            let fetchRequest: NSFetchRequest<Term> = Term.fetchRequest()
            fetchRequest.predicate = NSPredicate(format: "termType == %@ && value == %@", termType, value)
            let objects: [Term] = try managedContext.fetch(fetchRequest)
            return objects
        }
    }
    
}
