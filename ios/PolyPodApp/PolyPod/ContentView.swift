//
//  ContentView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 16.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

enum Views {
    case featureList
    case feature
    case onboarding
}

struct ContentView: View {
    @State private var firstRun = FirstRun.read()
    @State private var activeView = Views.featureList
    @State private var activeFeature: Feature? = nil

    var body: some View {
        if firstRun {
            OnboardingView(closeAction: {
                firstRun = false
                FirstRun.write(firstRun)
            })
        } else {
            switch activeView {
            case .featureList:
                FeatureListView(
                    features: FeatureStorage.shared.featuresList(),
                    openFeatureAction: { feature in
                        activeView = .feature
                        activeFeature = feature
                    },
                    openOnboardingAction: {
                        activeView = .onboarding
                    }
                )
            case .feature:
                FeatureView(
                    feature: activeFeature!,
                    closeAction: {
                        activeView = .featureList
                    }
                )
            case .onboarding:
                OnboardingView(closeAction: {
                    activeView = .featureList
                })
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
