// Please remove this line and the empty one after it

import SwiftUI

enum HomeScreenUIConstants {
    static let sectionSpacing = 32.0
    static let homeScreenHorizontalPadding = 8.0
    static let cardsSpacing = 16.0
}

enum HomeScreenSection {
    case yourData
    case dataKnowHow
    case tools
}

struct Card: Identifiable {
    let id = UUID()
    let title: String
    let description: String
    let imageName: String
    let backgroundColorHex: String
}

struct HomeScreenSectionModel {
    let title: String
    let cards: [Card]
    let type: HomeScreenSection
}

private struct BaseSizeKey: EnvironmentKey {
    static let defaultValue = CGSize(width: 0.0, height: 0.0)
}

extension EnvironmentValues {
  var baseSize: CGSize {
    get { self[BaseSizeKey.self] }
    set { self[BaseSizeKey.self] = newValue }
  }
}

struct HomeScreenView: View {
    
    var sections: [HomeScreenSectionModel] = [
        .init(title: "Your Data",
              cards: [
                .init(title: "polyExplorer",
                      description: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "nada",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c"),
                .init(title: "polyExplorer",
                      description: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem",
                      imageName: "heart.fill",
                      backgroundColorHex: "#0c1a3c")
              ],
              type: .yourData),
        
            .init(title: "Data KnowHow",
                  cards: [
                    .init(title: "polyExplorer",
                          description: "nada",
                          imageName: "heart.fill",
                          backgroundColorHex: "#0c1a3c"),
                    .init(title: "polyExplorer",
                          description: "nada",
                          imageName: "heart.fill",
                          backgroundColorHex: "#0c1a3c"),
                    .init(title: "polyExplorer",
                          description: "nada",
                          imageName: "heart.fill",
                          backgroundColorHex: "#0c1a3c"),
                    .init(title: "polyExplorer",
                          description: "nada",
                          imageName: "heart.fill",
                          backgroundColorHex: "#0c1a3c"),
                    .init(title: "polyExplorer",
                          description: "nada",
                          imageName: "heart.fill",
                          backgroundColorHex: "#0c1a3c")
                  ],
                  type: .dataKnowHow)
    ]
    
    var body: some View {
        // Why GeometryReader needs to be on top?
        GeometryReader { geo in
            ScrollView(showsIndicators: false) {
                ForEach(sections, id: \.type) { sectionModel in
                    switch sectionModel.type {
                    case .yourData:
                        MyDataSectionView(cards: sectionModel.cards)
                    case .dataKnowHow:
                        DataKnowHowSectionView(sectionModel: sectionModel)
                    default:
                        Text("Not yet!! Come next time...")
                    }
                    Spacer(minLength: HomeScreenUIConstants.sectionSpacing)
                }
            }
            .padding([.leading, .trailing], HomeScreenUIConstants.homeScreenHorizontalPadding)
            .environment(\.baseSize, CGSize(width: geo.size.width / 3, height: geo.size.width / 3))
        }
    }
}

struct MyDataSectionView: View {
    var cards: [Card]
    
    var body: some View {
        VStack(alignment: .leading) {
            ForEach(Array(cards.chunked(into: 3).enumerated()), id: \.offset) { index, chunk in
                switch index % 3 {
                case 0:
                    LargeLeftContainerView(cards: chunk)
                case 1:
                    RowContainerView(cards: chunk)
                case 2:
                    LargeRightContainerView(cards: chunk)
                default:
                    Color.clear
                }
            }
        }.padding(8)
    }
}

struct LargeLeftContainerView: View {
    @Environment(\.baseSize) var baseSize
    let cards: [Card]
    
    var body: some View {
        HStack(alignment: .top) {
            Rectangle().frame(width: 2 * baseSize.width, height: 2 * baseSize.height)
            VStack {
                ForEach(Array(cards.dropFirst())) { card in
                    Rectangle().frame(width: baseSize.width, height: baseSize.height)
                }
                if (cards.count < 2) {
                    Spacer()
                }
            }
        }
    }
}

struct LargeRightContainerView: View {
    @Environment(\.baseSize) var baseSize
    let cards: [Card]
    var body: some View {
        HStack {
            if cards.count <= 2 {
                ForEach(cards) { card in
                    Rectangle().frame(width: baseSize.width, height: baseSize.height)
                }
            } else {
                VStack {
                    ForEach(Array(cards.prefix(2))) { card in
                        Rectangle().frame(width: baseSize.width, height: baseSize.height)
                    }
                }
                Rectangle().frame(width: 2 * baseSize.width, height: 2 * baseSize.height)
            }
        }
    }
}

struct RowContainerView: View {
    @Environment(\.baseSize) var baseSize
    let cards: [Card]
    var body: some View {
        HStack {
            ForEach(cards) { card in
                Rectangle().frame(width: baseSize.width, height: baseSize.height)
            }
            
            if cards.count < 3 {
                Spacer()
            }
        }
    }
}

struct DataKnowHowSectionView: View {
    let sectionModel: HomeScreenSectionModel
    @Environment(\.baseSize) var baseSize
    
    
    private let columns: [GridItem] = [GridItem(.flexible(), spacing: HomeScreenUIConstants.cardsSpacing),
                                       GridItem(.flexible(), spacing: HomeScreenUIConstants.cardsSpacing),
                                       GridItem(.flexible(), spacing: HomeScreenUIConstants.cardsSpacing)]

    var body: some View {
        VStack(alignment: .leading) {
            Text(sectionModel.title).fontWeight(.bold)
            LazyVGrid(columns: columns, spacing: HomeScreenUIConstants.cardsSpacing) {
                
                ForEach(sectionModel.cards) { card in
                    SmallCardView(card: card)
                        .frame(width: baseSize.width - 2*HomeScreenUIConstants.cardsSpacing,
                               height: baseSize.width - 2*HomeScreenUIConstants.cardsSpacing)
                }
            }
        }
    }
}

struct BigCardView: View {
    enum Constants {
        static let verticalSpacing = 8.0
        static let padding = 8.0
        static let cornerRadius = 8.0
    }

    private let card: Card
    private let backgroundColor: Color
    @Environment(\.baseSize) var baseSize
    
    init(card: Card) {
        self.card = card
        self.backgroundColor = Color(fromHex: card.backgroundColorHex)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Constants.verticalSpacing) {
            Image(systemName: card.imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundColor(backgroundColor.isLight ? .black : .white)
                .frame(width: 2 * baseSize.width + HomeScreenUIConstants.cardsSpacing - 2 * Constants.padding, alignment: .center)
            
            VStack(alignment: .leading, spacing: Constants.verticalSpacing) {
                Text(card.title)
                    .foregroundColor(backgroundColor.isLight ? .black : .white)
                    .fontWeight(.bold)
                Text(card.description)
                    .foregroundColor(backgroundColor.isLight ? .black : .white)
            }
        }
        .padding(Constants.padding)
        .frame(width: 2 * baseSize.width + HomeScreenUIConstants.cardsSpacing,
               height: 2 * baseSize.width + HomeScreenUIConstants.cardsSpacing)
        .background(backgroundColor)
        .cornerRadius(Constants.cornerRadius)
    }
}
struct SmallCardView: View {
    enum Constants {
        static let verticalSpacing = 8.0
        static let padding = 8.0
        static let cornerRadius = 8.0
    }

    private let card: Card
    private let backgroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.backgroundColor = Color(fromHex: card.backgroundColorHex)
    }

    var body: some View {
        VStack(alignment: .center, spacing: Constants.verticalSpacing) {
            Image(systemName: card.imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .foregroundColor(backgroundColor.isLight ? .black : .white)
            Text(card.title)
                .foregroundColor(backgroundColor.isLight ? .black : .white)
        }
        
        .padding(Constants.padding)
        .background(backgroundColor)
        .cornerRadius(Constants.cornerRadius)
    }
}


struct HomeScreenView_Previews: PreviewProvider {
    static var previews: some View {
        HomeScreenView()
    }
}

extension Array {
    func chunked(into size: Int) -> [[Element]] {
        return stride(from: 0, to: count, by: size).map {
            Array(self[$0 ..< Swift.min($0 + size, count)])
        }
    }
}
