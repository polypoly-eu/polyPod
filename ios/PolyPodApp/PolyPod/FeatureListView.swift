import SwiftUI

struct FeatureListView: View {
    var features: [Feature]
    var openFeatureAction: (Feature) -> Void = { _ in }
    var openInfoAction: () -> Void = {}
    var openSettingsAction: () -> Void = {}
    
    var body: some View {
        VStack(spacing: 0) {
            NavigationBar(
                leading: AnyView(Button(action: openInfoAction) {
                    Image("NavIconInfoDark").renderingMode(.original)
                }),
                center: AnyView(Image("NavIconPolyPodLogo")),
                trailing: AnyView(Button(action: openSettingsAction) {
                    Image("NavIconSettingsDark").renderingMode(.original)
                })
            )
            .background(Color.PolyPod.lightBackground)
            
            Divider()
            
            ScrollView {
                VStack(spacing: 20) {
                    ForEach(features, id: \.name) { feature in
                        FeatureCard(feature)
                            .onTapGesture {
                                openFeatureAction(feature)
                            }
                    }
                }
                .padding(20)
            }
            .frame(
                maxWidth: .infinity,
                maxHeight: .infinity,
                alignment: .topLeading
            )
            .background(Color.PolyPod.semiLightBackground)
        }
    }
}

struct FeatureListView_Previews: PreviewProvider {
    static var previews: some View {
        FeatureListView(features: [
            createStubFeature(
                name: "polyExplorer",
                author: "polypoly Cooperative",
                description: """
                Have you ever wondered where your digital data goes and \
                which companies know how much about you and what the \
                implications are? polyExplorer is the feature that provides \
                those answers.
                """
            ),
            createStubFeature(
                name: "polyPinion",
                author: "polypoly Cooperative",
                description: """
                Have you ever wondered where your digital data goes and \
                which companies know how much about you and what the \
                implications are? polyExplorer is the feature that provides \
                those answers.
                """
            ),
            createStubFeature(
                name: "polyPreview",
                author: "polypoly Cooperative",
                description: """
                Have you ever wondered where your digital data goes and \
                which companies know how much about you and what the \
                implications are? polyExplorer is the feature that provides \
                those answers.
                """
            )
        ])
    }
}

private struct FeatureCard: View {
    private let feature: Feature
    
    init(_ feature: Feature) {
        self.feature = feature
    }
    
    var body: some View {
        VStack(spacing: 0) {
            if let thumbnail = feature.thumbnail {
                Image(
                    uiImage: UIImage(contentsOfFile: thumbnail.path)!
                )
                .resizable()
                .aspectRatio(contentMode: .fit)
            }
            
            VStack(alignment: .leading, spacing: 0) {
                Text(feature.name)
                    .font(.custom("Jost-Medium", size: 20))
                    .kerning(-0.2)
                    .foregroundColor(Color.PolyPod.darkForeground)
                
                Text(feature.author ?? "")
                    .font(.custom("Jost-Regular", size: 14))
                    .kerning(-0.14)
                    .foregroundColor(Color.PolyPod.darkForeground)
                
                ParagraphView(
                    text: feature.description ?? "",
                    fontName: "Jost-Regular",
                    fontSize: 16,
                    kerning: -0.16,
                    lineHeightMultiple: 0.83,
                    foregroundColor: Color.PolyPod.darkForeground
                )
                .padding(.top, 12)
            }
            .padding(16)
            .padding(.bottom, 8)
            .background(Color.white)
        }
        .frame(maxWidth: .infinity)
        .background(feature.primaryColor)
        .cornerRadius(15)
        .overlay(
            RoundedRectangle(cornerRadius: 15)
                .stroke(Color(fromHex: "#A9B6C6"), lineWidth: 1)
        )
    }
}
