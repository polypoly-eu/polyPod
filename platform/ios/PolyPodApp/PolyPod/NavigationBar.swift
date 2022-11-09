import SwiftUI

struct NavigationBar<Content: View>: View {
    var leading: Content?
    var center: Content?
    var trailing: Content?
    
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
