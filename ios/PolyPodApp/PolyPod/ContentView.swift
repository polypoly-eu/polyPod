//
//  ContentView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 16.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @State private var state = FirstRunStore.read() ? States.firstRun : States.featureList
    @State private var activeFeature: Feature? = nil

    var body: some View {
        switch state {
        case .firstRun:
            OnboardingView(closeAction: {
                FirstRunStore.write(false)
                state = .featureList
            })
        case .featureList:
            FeatureListView(
                features: FeatureStorage.shared.featuresList(),
                openFeatureAction: { feature in
                    activeFeature = feature
                    state = .feature
                },
                openInfoAction: {
                    state = .info
                }
            )
        case .feature:
            FeatureView(
                feature: activeFeature!,
                closeAction: {
                    state = .featureList
                }
            )
        case .info:
            OnboardingView(closeAction: {
                state = .featureList
            })
        }
    }

    private enum States {
        case firstRun
        case featureList
        case feature
        case info
    }
}

private struct FirstRunStore {
    private static let key = "firstRun"

    static func read() -> Bool {
        UserDefaults.standard.value(forKey: key) as? Bool ?? true
    }

    static func write(_ value: Bool) {
        UserDefaults.standard.set(value, forKey: key)
    }
}
