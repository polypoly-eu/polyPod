//
//  Preferences.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 24.03.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

import Foundation

class Preferences {
    
    private let filename: String = "preferences"
    
    lazy private var preferences: [String: Any]  = {
        var prefs: [String: Any] = [:]
        
        prefs["directusCredentials"] = ["email": "api@polypoly.eu", "password": "v~[U[f<{A5s|(<O3'{(9%5{Bc"]
        
        if let storedPreferences = try? JSONSerialization.loadJSON(withFilename: filename) as? [String : Any] {
            prefs = storedPreferences
        }
        
        return prefs
    }()
    

    func getValue(key: String) -> Any? {
        return preferences[key]
    }
    
    func setValue(key: String, value: Any) -> Bool {
        let prevValue = preferences[key]
        
        preferences[key] = value
        
        var result = false
        
        if let saved = try? JSONSerialization.save(jsonObject: preferences, toFilename: filename) {
            result = saved
        }
        
        if !result {
            preferences[key] = prevValue
        }
        
        return result
    }
}
