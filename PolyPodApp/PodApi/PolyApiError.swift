//
//  PolyApiError.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 03.07.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

enum PolyApiError: Error {
    case unknown
    case databaseError
    case badSearchQuery
    case paramterMissing
    case noSuchFile
}
