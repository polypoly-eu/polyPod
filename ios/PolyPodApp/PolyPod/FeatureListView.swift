//
//  FeatureListView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 13.04.21.
//

import SwiftUI

struct FeatureListView: View {
    var features: [Feature]
    var openFeatureAction: (Feature) -> Void = { _ in }
    var openOnboardingAction: () -> Void = {}

    var body: some View {
        VStack {
            HStack {
                Button("app_bar_info_button_desc", action: openOnboardingAction)

                Spacer()

                Text("app_name")

                Spacer()

                Button("settings_title", action: handleOpenSettings)
            }
            .padding(.horizontal, 8)
            .frame(maxWidth: .infinity, maxHeight: 40, alignment: .bottom)

            List() {
                Section(header: Text("Features:")) {
                    ForEach(features, id: \.name) { feature in
                        Button(feature.name) {
                            openFeatureAction(feature)
                        }
                    }
                }
            }
        }
    }

    private func handleOpenSettings() {
        UIApplication.shared.open(
            URL(string: UIApplication.openSettingsURLString)!,
            options: [:],
            completionHandler: nil)
    }
}

struct FeatureListView_Previews: PreviewProvider {
    static var previews: some View {
        FeatureListView(features: [
            createStubFeature(name: "Feature one"),
            createStubFeature(name: "Feature two")
        ])
    }
}
