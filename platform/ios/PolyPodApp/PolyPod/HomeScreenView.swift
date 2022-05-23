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

struct HomeScreenView: View {
    var sections: [HomeScreenSectionModel] = [
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
                  type: .dataKnowHow),
            .init(title: "Data KnowHow",
                  cards: [
                    .init(title: "polyExplorer",
                          description: "nada",
                          imageName: "heart.fill",
                          backgroundColorHex: "#0c1a3c")
                  ],
                  type: .tools)
    ]
    
    var body: some View {
        // Why GeometryReader needs to be on top?
        GeometryReader { geo in
            ScrollView(showsIndicators: false) {
                ForEach(sections, id: \.type) { sectionModel in
                    switch sectionModel.type {
                    case .dataKnowHow:
                        DataKnowHowSectionView(sectionModel: sectionModel, geometry: geo)
                    default:
                        Text("Not yet!! Come next time...")
                    }
                    Spacer(minLength: HomeScreenUIConstants.sectionSpacing)
                }
            }
            .padding([.leading, .trailing], HomeScreenUIConstants.homeScreenHorizontalPadding)
        }
    }
}

struct DataKnowHowSectionView: View {

    let sectionModel: HomeScreenSectionModel
    let geometry: GeometryProxy
    
    private let columns: [GridItem] = [GridItem(.flexible(), spacing: HomeScreenUIConstants.cardsSpacing),
                                       GridItem(.flexible(), spacing: HomeScreenUIConstants.cardsSpacing),
                                       GridItem(.flexible(), spacing: HomeScreenUIConstants.cardsSpacing)]

    var body: some View {
        VStack(alignment: .leading) {
            Text(sectionModel.title).fontWeight(.bold)
            LazyVGrid(columns: columns, spacing: HomeScreenUIConstants.cardsSpacing) {
                
                ForEach(sectionModel.cards) { card in
                    SmallCardView(card: card)
                        .frame(width: (geometry.size.width - 2*HomeScreenUIConstants.cardsSpacing) / 3,
                               height: (geometry.size.width - 2*HomeScreenUIConstants.cardsSpacing) / 3)
                }
            }
        }
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
