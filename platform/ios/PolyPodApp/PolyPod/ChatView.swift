// Please remove this line and the empty one after it

import SwiftUI

struct ChatView: View {
    @State var text: String = ""
    @ObservedObject var client = MatrixClient.instance
    var body: some View {
        VStack(spacing: 16) {
            ScrollView {
                ForEach(client.messages) { message in
                    VStack(alignment: .leading, spacing: 8) {
                        Text(message.sender).fontWeight(.bold)
                        Text(message.text).fontWeight(.light)
                        Divider()
                    }
                }
            }
            TextField("Send Message", text: $text)
                .padding()
                .border(.gray, width: 2.0)
                .cornerRadius(4)
            Button("Send") {
                client.sendMessage(text)
                text = ""
            }
        }.padding()
    }
}

struct ChatView_Previews: PreviewProvider {
    static var previews: some View {
        ChatView()
    }
}
