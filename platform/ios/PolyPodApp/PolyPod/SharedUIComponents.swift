import SwiftUI

struct PrimaryButton: View {
    let title: LocalizedStringKey
    let onAction: () -> Void

    var body: some View {
        Button(action: onAction) {
            Text(title)
                .font(.custom("Jost-Medium", size: 14))
                .kerning(-0.18)
                .foregroundColor(Color.PolyPod.darkForeground)
                .frame(minWidth: 296, minHeight: 48)
                .background(
                    RoundedRectangle(cornerRadius: 4)
                        .fill(Color(fromHex: "#FB8A89"))
                        .shadow(
                            color: Color.black.opacity(0.06),
                            radius: 2,
                            x: 0,
                            y: 1
                        )
                        .shadow(
                            color: Color.black.opacity(0.1),
                            radius: 3,
                            x: 0,
                            y: 1
                        )
                )
        }
        .buttonStyle(PlainButtonStyle())
        .frame(maxWidth: .infinity, alignment: .center)
    }
}
