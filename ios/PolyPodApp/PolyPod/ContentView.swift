//
//  ContentView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 16.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @State private var firstRun = FirstRun.read()

    var body: some View {
        NavigationView {
            if firstRun {
                OnboardingView(closeAction: {
                    firstRun = false
                    FirstRun.write(firstRun)
                })
            } else {
                FeatureListView(FeatureStorage.shared.featuresList())
            }
        }
    }
}

private struct FirstRun {
    private static let key = "firstRun"

    static func read() -> Bool {
        UserDefaults.standard.value(forKey: key) as? Bool ?? true
    }

    static func write(_ value: Bool) {
        UserDefaults.standard.set(value, forKey: key)
    }
}
