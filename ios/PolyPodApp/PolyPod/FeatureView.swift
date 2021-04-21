//
//  FeatureView.swift
//  PolyPod
//
//  Created by Felix Dahlke on 13.04.21.
//  Copyright © 2021 polypoly. All rights reserved.
//

import SwiftUI

struct FeatureView: View {
    @Environment(\.presentationMode) var presentationMode: Binding<PresentationMode>

    let feature: Feature
    var closeAction: () -> Void = {}

    @State var title: String = ""
    @State var activeActions: [String] = []
    @State var queuedAction: (String, DispatchTime)? = nil

    var body: some View {
        // On Android, we calculate this based on the feature colour's luminance,
        // we should do the same here.
        let lightForeground = feature.name == "polyExplorer"
        let iconVariantQualifier = lightForeground ? "Light" : "Dark"

        VStack(spacing: 0) {
            ZStack {
                HStack {
                    Button(
                        action: {
                            if activeActions.contains("back") {
                                triggerFeatureAction("back")
                                return
                            }
                            closeAction()
                        }
                    ) {
                        let qualifier = activeActions.contains("back") ? "Back" : "Close"
                        Image("NavIcon\(qualifier)\(iconVariantQualifier)")
                    }

                    Spacer()

                    if activeActions.contains("info") {
                        Button(action: { triggerFeatureAction("info") }) {
                            Image("NavIconInfo\(iconVariantQualifier)")
                        }
                    }

                    if activeActions.contains("search") {
                        Button(action: { triggerFeatureAction("search") }) {
                            Image("NavIconInfo\(iconVariantQualifier)")
                        }
                    }
                }

                Text(title != "" ? title : feature.name)
                    .foregroundColor(lightForeground ? Color.PolyPod.lightForeground : Color.PolyPod.darkForeground)
                    .font(.custom("Jost-Medium", size: 16))
                    .kerning(-0.16)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
            .padding(.horizontal, 8)
            .frame(maxWidth: .infinity, maxHeight: 42, alignment: .center)
            .background(feature.primaryColor)

            FeatureContainerView(
                feature: feature,
                title: $title,
                activeActions: $activeActions,
                queuedAction: queuedAction,
                openUrlHandler: openUrl
            )
        }
    }

    private func openUrl(target: String) {
        let viewController = UIApplication.shared.windows.first!.rootViewController!
        guard let urlString = feature.findUrl(target: target) else {
            let alert = UIAlertController(
                title: "",
                message: String.localizedStringWithFormat(
                    NSLocalizedString("message_url_open_prevented %@ %@", comment: ""),
                    feature.name, target
                ),
                preferredStyle: UIAlertController.Style.alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            viewController.present(alert, animated: true, completion: nil)
            return
        }
        guard let url = URL(string: urlString) else {
            print("Error: Invalid URL format: \(urlString)")
            return
        }
        let alert = UIAlertController(
            title: "",
            message: String.localizedStringWithFormat(
                NSLocalizedString("message_url_open_requested %@ %@", comment: ""),
                feature.name, urlString
            ),
            preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(
                            title: NSLocalizedString("button_url_open_confirm", comment: ""),
                            style: .default,
                            handler: { (action: UIAlertAction!) in
                                UIApplication.shared.open(url)
                            }))
        alert.addAction(UIAlertAction(
                            title: NSLocalizedString("button_url_open_reject", comment: ""),
                            style: .default))
        viewController.present(alert, animated: true, completion: nil)
    }

    private func triggerFeatureAction(_ action: String) {
        queuedAction = (action, DispatchTime.now())
    }
}

struct FeatureView_Previews: PreviewProvider {
    static var previews: some View {
        FeatureView(feature: createStubFeature(name: "polyExplorer"))
        FeatureView(feature: createStubFeature(name: "polyPreview"))
    }
}
