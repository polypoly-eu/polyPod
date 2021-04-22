import SwiftUI

struct NavigationBar<Content: View>: View {
    var leading: Content? = nil
    var center: Content? = nil
    var trailing: Content? = nil
    
    var body: some View {
        ZStack {
            center.frame(maxWidth: .infinity, alignment: .center)
            
            HStack {
                leading
                Spacer()
                trailing
            }
        }
        .padding(.horizontal, 8)
        .frame(maxWidth: .infinity, maxHeight: 42)
    }
}
