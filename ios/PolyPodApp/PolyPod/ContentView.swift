//
//  ContentView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 16.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct ContentView: View {
    @State private var state: (() -> AnyView)? = nil

    var body: some View {
        if let state = state {
            state()
        } else {
            EmptyView().onAppear {
                state = firstRunState
            }
        }
    }

    private func firstRunState() -> AnyView {
        let defaults = UserDefaults.standard
        let firstRunKey = "firstRun"
        let firstRun = defaults.value(forKey: firstRunKey) as? Bool ?? true
        if !firstRun {
            return featureListState()
        }

        return AnyView(
            OnboardingView(closeAction: {
                UserDefaults.standard.set(false, forKey: firstRunKey)
                state = featureListState
            })
        )
    }

    private func featureListState() -> AnyView {
        AnyView(
            FeatureListView(
                features: FeatureStorage.shared.featuresList(),
                openFeatureAction: { feature in
                    state = { featureState(feature) }
                },
                openInfoAction: {
                    state = infoState
                }
            )
        )
    }

    private func featureState(_ feature: Feature) -> AnyView {
        AnyView(
            FeatureView(
                feature: feature,
                closeAction: {
                    state = featureListState
                }
            )
        )
    }

    private func infoState() -> AnyView {
        AnyView(
            OnboardingView(closeAction: {
                state = featureListState
            })
        )
    }
}
