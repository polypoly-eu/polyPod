import SwiftUI

/**
 Like SwiftUI.GeometryReader, but leaves the height alone
 
 SwiftUi.GeometryReader takes up all the available space, horizontally and vertically,
 which is problematic when its content should take up the available width, but not height.
 This is a somewhat hacky workaround.
 */
struct WidthReader<Content: View>: View {
    let content: (CGFloat) -> Content
    @State private var width: CGFloat = WidthKey.defaultValue
    
    var body: some View {
        content(width)
            .frame(maxWidth: .infinity, maxHeight: nil, alignment: .leading)
            .background(GeometryReader { geometry in
                Color.clear.preference(
                    key: WidthKey.self,
                    value: geometry.size.width
                )
            })
            .onPreferenceChange(WidthKey.self) {
                width = $0
            }
    }
    
    private struct WidthKey: PreferenceKey {
        static var defaultValue: CGFloat {
            return 1
        }
        
        static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
            value = max(value, nextValue())
        }
    }
}
