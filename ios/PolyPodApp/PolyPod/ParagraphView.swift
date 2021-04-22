import SwiftUI

/**
 UILabel-based view for text paragraphs

 We ran into some limitations with SwiftUI.Text for rendering paragraphs of texts,
 e.g. being unable to lower line height, or use a negative line spacing. Ideally,
 we transition to SwiftUI.Text once it properly supports these things.
 */
struct ParagraphView: View {
    var text: LocalizedStringKey
    var fontName: String? = nil
    var fontSize: CGFloat? = nil
    var kerning: CGFloat? = nil
    var lineHeightMultiple: CGFloat? = nil
    var foregroundColor: Color? = nil

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
    var text: LocalizedStringKey
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
            label.textColor = UIColor(textColor)
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
            string: text.toLocalizedString(),
            attributes: attributes
        )
    }
}
