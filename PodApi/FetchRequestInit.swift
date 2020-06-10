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
    
    init(initData: [MessagePackValue: MessagePackValue]?) {

        body = initData?["body"]?.stringValue
        method = initData?["method"]?.stringValue
    }
}
