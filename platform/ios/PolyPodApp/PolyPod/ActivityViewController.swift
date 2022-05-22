import SwiftUI

struct ActivityViewController: UIViewControllerRepresentable {
    
    var activityItems: [Any]
    var applicationActivities: [UIActivity]?
    @Environment(\.presentationMode) var presentationMode
    
    func makeUIViewController(
        context: UIViewControllerRepresentableContext<ActivityViewController>
        ) -> UIActivityViewController {
        let controller = UIActivityViewController(
            activityItems: activityItems, 
            applicationActivities: applicationActivities
        )
        controller.completionWithItemsHandler = { (_, _, _, _) in
            self.presentationMode.wrappedValue.dismiss()
        }
        return controller
    }

    func updateUIViewController(
        _ uiViewController: UIActivityViewController, 
        context: UIViewControllerRepresentableContext<ActivityViewController>
    ) {}
}
