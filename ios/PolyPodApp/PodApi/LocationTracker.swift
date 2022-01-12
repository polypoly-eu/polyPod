import UIKit
import CoreLocation

class LocationTracker: NSObject, CLLocationManagerDelegate {
    static let shared = LocationTracker()
    
    private let LAST_LOCATION_DATE = "LAST_LOCATION_DATE"
    
    private let SETTINGS_LAST_LOCATION_TIME_INTERVAL = TimeInterval(60)
    
    private let locationManager = CLLocationManager()
    
    override init() {
        super.init()
        
        locationManager.delegate = self
    }
    
    func startLocationLogging() {
        if !CLLocationManager.significantLocationChangeMonitoringAvailable() {
            return
        }
        
        locationManager.requestAlwaysAuthorization()
        locationManager.startUpdatingLocation()
    }
    
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        for location in locations {
            checkAndStoreLocation(location)
        }
    }
    
    private func checkAndStoreLocation(_ location: CLLocation) {
        var lastLocationDate = Date.distantPast
        if let date = UserDefaults.standard.object(forKey: LAST_LOCATION_DATE) as? Date {
            lastLocationDate = date
        }
        
        let timeInterval = location.timestamp.timeIntervalSince(lastLocationDate)
        if timeInterval >= SETTINGS_LAST_LOCATION_TIME_INTERVAL {
            print(location)
            UserDefaults.standard.set(location.timestamp, forKey: LAST_LOCATION_DATE)
            CoreDataStack.shared.perform {  managedContext in
                let quads = CLLocation.entityModel().toQuads(entity: location, context: managedContext)
                // This value was previously unused - since this code isn't being used at the moment, we just print it for now
                print(quads)
            }
        }
    }
}

/*
subject: "polyId:ff8bb955-3513-4990-9cb6-42790a3769ff", predicate: "@type", object: "https://schema.org/GeoCoordinates"
subject: "polyId:ff8bb955-3513-4990-9cb6-42790a3769ff", predicate: "https://schema.org/latitude", object: "40.75"
subject: "polyId:ff8bb955-3513-4990-9cb6-42790a3769ff", predicate: "https://schema.org/longitude", object: "73.98"
subject: "polyId:3ae0caa4-0310-44c5-9e5e-c75f6ccc4f93", predicate: "@type", object: "https://schema.org/Place"
subject: "polyId:3ae0caa4-0310-44c5-9e5e-c75f6ccc4f93", predicate: "https://schema.org/geo", object: "polyId:ff8bb955-3513-4990-9cb6-42790a3769ff"
subject: "polyId:944d5581-afa6-4661-a719-44728dd12b56", predicate: "@type", object: "https://schema.org/Event"
subject: "polyId:944d5581-afa6-4661-a719-44728dd12b56", predicate: "https://schema.org/location", object: "polyId:3ae0caa4-0310-44c5-9e5e-c75f6ccc4f93"
subject: "polyId:944d5581-afa6-4661-a719-44728dd12b56", predicate: "https://schema.org/startDate", object: "2020-08-19T12:24:21"
subject: "polyId:944d5581-afa6-4661-a719-44728dd12b56", predicate: "https://schema.org/endDate", object: "2020-08-19T12:35:18"
*/
