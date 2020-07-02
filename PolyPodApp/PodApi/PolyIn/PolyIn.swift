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
    
    func selectQuads(matcher: ExtendedData, completionHandler: ([ExtendedData]?) -> Void) {
        guard let appDelegate = UIApplication.shared.delegate as? AppDelegate else {
            completionHandler(nil)
            return
        }
        
        let managedContext = appDelegate.persistentContainer.viewContext
        
        let subject = matcher.properties["subject"] as! ExtendedData
        let predicate = matcher.properties["predicate"] as! ExtendedData
        let object = matcher.properties["object"] as! ExtendedData
        
        let fetchRequest: NSFetchRequest<Quad> = Quad.fetchRequest()
        let formatTermType = "subject.termType == %@ && predicate.termType == %@ && object.termType == %@"
        let formatValue = "subject.value == %@ && predicate.value == %@ && object.value == %@"
        let arguments: [Any] = [subject.properties["termType"] as! String, predicate.properties["termType"] as! String, object.properties["termType"] as! String, subject.properties["value"] as! String, predicate.properties["value"] as! String, object.properties["value"] as! String]
        fetchRequest.predicate = NSPredicate(format: formatTermType + "  && " + formatValue, argumentArray: arguments)
        
        do {
            let quads = try managedContext.fetch(fetchRequest)
            var result: [ExtendedData] = []
            for quad in quads {
                let extendedData = createExtendedData(for: quad)
                result.append(extendedData)
            }
            completionHandler(result)
        } catch {
            completionHandler(nil)
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
}
