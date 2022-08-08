import PolyPodCoreSwift
import SwiftUI

struct FeatureView: View {
    @Environment(\.presentationMode)
    var presentationMode: Binding<PresentationMode>

    let feature: Feature
    var closeAction: () -> Void = {}

    @State var title: String = ""
    @State var activeActions: [String] = []
    @State var queuedAction: (String, DispatchTime)?
    @State var filePicker = FilePicker()

    var body: some View {
        let featureColor = Color(fromHex: feature.primaryColor)
        let lightForeground = !featureColor.isLight
        let iconVariantQualifier = lightForeground ? "Light" : "Dark"

        // swiftlint:disable multiple_closures_with_trailing_closure
        let closeButton = Button(
            action: {
                if activeActions.contains("back") {
                    triggerFeatureAction("back")
                    return
                }
                closeAction()
            }) {
                let qualifier = activeActions.contains("back") ? "Back" : "Close"
                Image("NavIcon\(qualifier)\(iconVariantQualifier)")
                    .renderingMode(.original)
            }.accessibilityElement()
            .accessibilityIdentifier("feature_close_button")
        // swiftlint:enable multiple_closures_with_trailing_closure

        let titleLabel = Text(!title.isEmpty ? title : feature.name)
            .foregroundColor(
                lightForeground
                    ? Color.PolyPod.lightForeground
                    : Color.PolyPod.darkForeground
            )
            .font(.custom("Jost-Medium", size: 16))
            .kerning(-0.16)
            .frame(maxWidth: .infinity, alignment: .center)
            .accessibilityElement()
            .accessibilityIdentifier("feature_title_text")

        let actionButtons = HStack(spacing: 12) {
            if activeActions.contains("search") {
                // swiftlint:disable multiple_closures_with_trailing_closure
                Button(action: { triggerFeatureAction("search") }) {
                    Image("NavIconSearch\(iconVariantQualifier)")
                        .renderingMode(.original)
                }
                // swiftlint:enable multiple_closures_with_trailing_closure

            }

            if activeActions.contains("info") {
                // swiftlint:disable multiple_closures_with_trailing_closure
                Button(action: { triggerFeatureAction("info")}) {
                    Image("NavIconInfo\(iconVariantQualifier)")
                        .renderingMode(.original)
                }
                // swiftlint:enable multiple_closures_with_trailing_closure

            }
        }

        VStack(spacing: 0) {
            NavigationBar(
                leading: AnyView(closeButton),
                center: AnyView(titleLabel),
                trailing: AnyView(actionButtons)
            )
            .background(featureColor)

            FeatureContainerView(
                feature: feature,
                title: $title,
                activeActions: $activeActions,
                queuedAction: queuedAction,
                errorHandler: handleError,
                openUrlHandler: openUrl,
                pickFileHandler: pickFile
            )
        }.accessibilityElement()
        .accessibilityIdentifier("feature_view")
    }

    private func handleError(_ errorMsg: String) {
        let alert = UIAlertController(
            title: "",
            message: String.localizedStringWithFormat(
                NSLocalizedString(
                    "message_feature_error %@ %@",
                    comment: ""
                ),
                feature.name, errorMsg
            ),
            preferredStyle: .alert
        )
        alert.addAction(UIAlertAction(
            title: NSLocalizedString(
                "button_error_report",
                comment: ""
            ),
            style: .default,
            handler: { _ in
                closeAction()
                ErrorUploader.shared.uploadToServer(errorMsg, completionHandler: { _, error in
                        if error != nil {
                            Log.error("Upload failed: \(error!.description)")
                            return
                        }
                        Log.debug("Error uploaded successfully")
                    }
                )
            }
        ))

        alert.view.isAccessibilityElement = true
        alert.view.accessibilityIdentifier = "feature_error_popup"

        UIApplication.shared.windows.first!.rootViewController!.present(
            alert,
            animated: true,
            completion: nil
        )
    }

    private func openUrl(target: String) {
        let viewController =
            UIApplication.shared.windows.first!.rootViewController!
        guard let urlString = feature.findUrl(target: target) else {
            let alert = UIAlertController(
                title: "",
                message: String.localizedStringWithFormat(
                    NSLocalizedString(
                        "message_url_open_prevented %@ %@",
                        comment: ""
                    ),
                    feature.name, target
                ),
                preferredStyle: UIAlertController.Style.alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            viewController.present(alert, animated: true, completion: nil)
            return
        }
        guard let url = URL(string: urlString) else {
            Log.error("openUrl: Invalid URL format: \(urlString)")
            return
        }
        let alert = UIAlertController(
            title: "",
            message: String.localizedStringWithFormat(
                NSLocalizedString(
                    "message_url_open_requested %@ %@",
                    comment: ""
                ),
                feature.name, urlString
            ),
            preferredStyle: UIAlertController.Style.alert)
        alert.addAction(UIAlertAction(
                            title: NSLocalizedString(
                                "button_confirm",
                                comment: ""
                            ),
                            style: .default,
                            handler: { _ in
                                UIApplication.shared.open(url)
                            }))
        alert.addAction(UIAlertAction(
                            title: NSLocalizedString(
                                "button_reject",
                                comment: ""
                            ),
                            style: .default))
        viewController.present(alert, animated: true, completion: nil)
    }

    private func pickFile(type: String?, completion: @escaping (ExternalFile?) -> Void) {
        filePicker.pick(type: type, completion: completion)
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
