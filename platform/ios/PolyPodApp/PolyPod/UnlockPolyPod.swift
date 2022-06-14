// Please remove this line and the empty one after it

import SwiftUI

struct UnlockPolyPod: View {
    var onCompleted: () -> Void = {}

    var body: some View {
        VStack(alignment: .center, spacing: 32) {
            Spacer()
            Image("NavIconPolyPodLogo")
            Spacer()
            PrimaryButton(title: "auth_prompt_unlock", onAction: authenticate)
        }
        .padding(.vertical, 32)
        .onAppear(perform: authenticate)
    }
    
    private func authenticate() {
        Authentication.shared.authenticate { success in
            if success {
                DispatchQueue.main.async {
                    onCompleted()
                }
            }
        }
    }
}

struct UnlockPolyPod_Previews: PreviewProvider {
    static var previews: some View {
        UnlockPolyPod()
    }
}
