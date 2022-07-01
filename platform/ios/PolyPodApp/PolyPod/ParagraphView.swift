import SwiftUI

/**
 UILabel-based view for text paragraphs
 
 We ran into some limitations with SwiftUI.Text for rendering paragraphs of texts,
 e.g. being unable to lower line height, or use a negative line spacing. Ideally,
 we transition to SwiftUI.Text once it properly supports these things.
 */
struct ParagraphView: View {
    private let text: String
    private let font: UIFont?
    private let kerning: CGFloat?
    private let lineHeightMultiple: CGFloat?
    private let foregroundColor: Color?
    private let textAlignment: NSTextAlignment?
    
    init(
        text: String,
        font: UIFont? = nil,
        kerning: CGFloat? = nil,
        lineHeightMultiple: CGFloat? = nil,
        foregroundColor: Color? = nil,
        textAlignment: NSTextAlignment? = nil
    ) {
        self.text = text
        self.font = font
        self.kerning = kerning
        self.lineHeightMultiple = lineHeightMultiple
        self.foregroundColor = foregroundColor
        self.textAlignment = textAlignment
    }
    
    init(
        text: LocalizedStringKey,
        font: UIFont? = nil,
        kerning: CGFloat? = nil,
        lineHeightMultiple: CGFloat? = nil,
        foregroundColor: Color? = nil,
        textAlignment: NSTextAlignment? = nil
    ) {
        self.init(
            text: text.toLocalizedString(),
            font: font,
            kerning: kerning,
            lineHeightMultiple: lineHeightMultiple,
            foregroundColor: foregroundColor,
            textAlignment: textAlignment)
    }
    
    var body: some View {
        WidthReader { width in
            UILabelView(
                text: text,
                preferredMaxLayoutWidth: width,
                kerning: kerning,
                font: font,
                lineHeightMultiple: lineHeightMultiple,
                tileTextColor: foregroundColor,
                textAlignment: textAlignment
            )
        }
    }
}

private struct UILabelView: UIViewRepresentable {
    var text: String
    var preferredMaxLayoutWidth: CGFloat
    var kerning: CGFloat?
    var font: UIFont?
    var lineHeightMultiple: CGFloat?
    var tileTextColor: Color?
    var textAlignment: NSTextAlignment?
    
    func makeUIView(context: Context) -> UILabel {
        let label = UILabel()
        label.numberOfLines = 0
        label.lineBreakMode = .byWordWrapping
        label.setContentHuggingPriority(.defaultHigh, for: .vertical)
        return label
    }
    
    func updateUIView(_ label: UILabel, context: Context) {
        label.preferredMaxLayoutWidth = preferredMaxLayoutWidth
        
        if let tileTextColor = tileTextColor {
            label.textColor = UIColor.compatInit(tileTextColor)
        }
        
        if let font = font {
            label.font = font
        } 

        var attributes: [NSAttributedString.Key: Any] = [:]
        
        if let kerning = kerning {
            attributes[NSAttributedString.Key.kern] = kerning
        }
        
        if let lineHeightMultiple = lineHeightMultiple {
            let paragraphStyle = NSMutableParagraphStyle()
            paragraphStyle.lineHeightMultiple = lineHeightMultiple
            if let textAlignment = textAlignment {
                paragraphStyle.alignment = textAlignment
            }
            attributes[NSAttributedString.Key.paragraphStyle] = paragraphStyle
        }
        
        label.attributedText = NSMutableAttributedString(
            string: text,
            attributes: attributes
        )
    }
}
