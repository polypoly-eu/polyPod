import CoreLocation

extension CLLocation: LiftedEntity {
    static func entityModel() -> EntityModel {
        var valueModels: [String: ValueModel] = [:]
        
        valueModels["latitute"] = ValueModel(type: "Text")
        valueModels["longitude"] = ValueModel(type: "Text")
        
        let entityModel = EntityModel(schema: "https://schema.org/", type: "GeoCoordinates", valueModels: valueModels)
        
        return entityModel
    }
    
    func value(for property: String) -> String {
        switch property {
        case "latitude":
            return String(coordinate.latitude)
        case "longitude":
            return String(coordinate.longitude)
        default:
            return ""
        }
    }
}
