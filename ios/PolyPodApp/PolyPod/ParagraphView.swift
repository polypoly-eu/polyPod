import SwiftUI

/**
 UILabel-based view for text paragraphs
 
 We ran into some limitations with SwiftUI.Text for rendering paragraphs of texts,
 e.g. being unable to lower line height, or use a negative line spacing. Ideally,
 we transition to SwiftUI.Text once it properly supports these things.
 */
struct ParagraphView: View {
    private let text: String
    private let fontName: String?
    private let fontSize: CGFloat?
    private let kerning: CGFloat?
    private let lineHeightMultiple: CGFloat?
    private let foregroundColor: Color?
    
    init(
        text: String,
        fontName: String? = nil,
        fontSize: CGFloat? = nil,
        kerning: CGFloat? = nil,
        lineHeightMultiple: CGFloat? = nil,
        foregroundColor: Color? = nil
    ) {
        self.text = text
        self.fontName = fontName
        self.fontSize = fontSize
        self.kerning = kerning
        self.lineHeightMultiple = lineHeightMultiple
        self.foregroundColor = foregroundColor
    }
    
    init(
        text: LocalizedStringKey,
        fontName: String? = nil,
        fontSize: CGFloat? = nil,
        kerning: CGFloat? = nil,
        lineHeightMultiple: CGFloat? = nil,
        foregroundColor: Color? = nil
    ) {
        self.text = text.toLocalizedString()
        self.fontName = fontName
        self.fontSize = fontSize
        self.kerning = kerning
        self.lineHeightMultiple = lineHeightMultiple
        self.foregroundColor = foregroundColor
    }
    
    var body: some View {
        WidthReader { width in
            UILabelView(
                text: text,
                preferredMaxLayoutWidth: width,
                fontName: fontName,
                fontSize: fontSize,
                kerning: kerning,
                lineHeightMultiple: lineHeightMultiple,
                textColor: foregroundColor
            )
        }
    }
}

private struct UILabelView: UIViewRepresentable {
    var text: String
    var preferredMaxLayoutWidth: CGFloat
    var fontName: String? = nil
    var fontSize: CGFloat? = nil
    var kerning: CGFloat? = nil
    var lineHeightMultiple: CGFloat? = nil
    var textColor: Color? = nil
    
    func makeUIView(context: Context) -> UILabel {
        let label = UILabel()
        label.numberOfLines = 0
        label.lineBreakMode = .byWordWrapping
        label.setContentHuggingPriority(.defaultHigh, for: .vertical)
        return label
    }
    
    func updateUIView(_ label: UILabel, context: Context) {
        label.preferredMaxLayoutWidth = preferredMaxLayoutWidth
        
        if let textColor = textColor {
            label.textColor = UIColor.compatInit(textColor)
        }
        
        if let fontName = fontName, let fontSize = fontSize {
            label.font = UIFont(name: fontName, size: fontSize)
        }
        
        var attributes: [NSAttributedString.Key: Any] = [:]
        
        if let kerning = kerning {
            attributes[NSAttributedString.Key.kern] = kerning
        }
        
        if let lineHeightMultiple = lineHeightMultiple {
            let paragraphStyle = NSMutableParagraphStyle()
            paragraphStyle.lineHeightMultiple = lineHeightMultiple
            attributes[NSAttributedString.Key.paragraphStyle] = paragraphStyle
        }
        
        label.attributedText = NSMutableAttributedString(
            string: text,
            attributes: attributes
        )
    }
}
