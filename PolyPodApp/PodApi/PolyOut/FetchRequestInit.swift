//
//  FetchRequestInit.swift
//  PolyPod
//
//  Created by Carmen Burmeister on 10.06.20.
//  Copyright © 2020 polypoly. All rights reserved.
//

struct FetchRequestInit {

    let body: String?
    let method: String?
    
    init(with dictionary: [String: Any]) {
        body = dictionary["body"] as? String
        method = dictionary["method"] as? String
    }
}
