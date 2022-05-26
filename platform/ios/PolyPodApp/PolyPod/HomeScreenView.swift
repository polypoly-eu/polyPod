// Please remove this line and the empty one after it

import SwiftUI
import Combine

// MARK: - Model

struct Card: Identifiable {
    let id: FeatureId
    let title: String
    let description: String
    let image: UIImage
    let backgroundColor: Color
}

struct HomeScreenSectionModel {
    let title: String
    let cards: [Card]
    let type: CategoryId
}

struct FooterViewModel {
    let title: String
    let description: String
    let imageName: String
    let backgroundColor: Color
    let buttonTitle: String
    let buttonBackgroundColor: Color
}

protocol HomeScreenStorage {
    var categoriesList: AnyPublisher<[HomeScreenSectionModel], Never> { get }
}

final class HomeScreenStorageAdapter: HomeScreenStorage {
    let categoriesList: AnyPublisher<[HomeScreenSectionModel], Never>
    let featureStorage: FeatureStorage
    
    init(featureStorage: FeatureStorage) {
        self.featureStorage = featureStorage
        self.categoriesList = featureStorage.categoriesList.map(HomeScreenStorageAdapter.mapCategoryModel(_:)).eraseToAnyPublisher()
    }
    
    static func mapCategoryModel(_ categoryModels: [CategoryModel]) -> [HomeScreenSectionModel] {
        categoryModels.map { model in
            HomeScreenSectionModel(title: model.name,
                                   cards: mapToCards(model.features),
                                   type: model.id)
        }
    }
    
    private static func mapToCards(_ features: [Feature]) -> [Card] {
        features.map { feature in
            Card(id: feature.id,
                 title: feature.name,
                 description: feature.description ?? "",
                 image: UIImage(contentsOfFile: feature.thumbnail?.path ?? "") ?? UIImage(),
                 backgroundColor: feature.thumbnailColor ?? .white)
        }
    }
}

final class HomeScreenViewModel: ObservableObject {
    private var storage: HomeScreenStorage
    private var storageCancellable: AnyCancellable?
    @Published var sections: [HomeScreenSectionModel] = []
    
    init(storage: HomeScreenStorage) {
        self.storage = storage
    }
    
    func setup() {
        storageCancellable = storage.categoriesList.sink { sections in
            self.sections = sections
        }
    }
}

// MARK: - UI sizes

struct Constants {
    struct Section {
        static let verticalSpacing = 32.0
    }
    
    struct View {
        static let horizontalPadding = 8.0
    }
    
    struct TileContainer {
        static let verticalSpacing = 16.0
        static let horizontalSpacing = 16.0
        static let numberOfColumns = 3
    }
    
    struct Tile {
        static let verticalSpacing = 8.0
        static let horizontalSpacing = 8.0
        static let padding = 8.0
        static let cornerRadius = 8.0
    }
}

struct Sizes {
    let screenSize: CGSize
    let containerWidth: CGFloat
    let smallTileWidth: CGFloat
    let mediumTileWidth: CGFloat
    let bigTileWidth: CGFloat
}

struct HomeScreenSizesKey: EnvironmentKey {
    typealias Value = Sizes
    static let defaultValue: Sizes = Sizes(screenSize: .zero, containerWidth: .zero, smallTileWidth: .zero, mediumTileWidth: .zero, bigTileWidth: .zero)
}

extension EnvironmentValues {
  var homeScreenTileSizes: Sizes {
    get { self[HomeScreenSizesKey.self] }
    set { self[HomeScreenSizesKey.self] = newValue }
  }
}

// MARK: - Root View

struct HomeScreenView: View {
    
    let footerModel = FooterViewModel(title: "Like what you have seen?",
                                      description: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
                                      imageName: "FacebookImport",
                                      backgroundColor: Color(fromHex: "#fed7d6"),
                                      buttonTitle: "Learn more",
                                      buttonBackgroundColor: Color(fromHex: "#0f1938"))
    
    @ObservedObject var viewModel: HomeScreenViewModel
    
    var body: some View {
        // Why GeometryReader needs to be on top?
        GeometryReader { geo in
            ScrollView(showsIndicators: false) {
                ForEach(viewModel.sections, id: \.type) { sectionModel in
                    switch sectionModel.type {
                    case .yourData:
                        MyDataSectionView(sectionModel: sectionModel)
                    case .knowHow:
                        DataKnowHowSectionView(sectionModel: sectionModel)
                    case .tools:
                        ToolsSectionView(sectionModel: sectionModel)
                    case .other:
                        OtherSectionView(sectionModel: sectionModel)
                    }
                    Spacer(minLength: Constants.Section.verticalSpacing)
                }
                FooterView(model: footerModel)
            }
            .padding([.leading, .trailing], Constants.View.horizontalPadding)
            .environment(\.homeScreenTileSizes, calculateSize(geo))
        }.onAppear {
            viewModel.setup()
        }
    }
    
    func calculateSize(_ geo: GeometryProxy) -> Sizes {
        let screenWidth = geo.size.width
        
        let totalScreenPadding = 2 * Constants.View.horizontalPadding
        let containerWidth: CGFloat = screenWidth - totalScreenPadding
        
        let interItemSpacing = (Double(Constants.TileContainer.numberOfColumns) - 1.0) * Constants.TileContainer.horizontalSpacing
        let smallTileWidth: CGFloat = (containerWidth - interItemSpacing) / Double(Constants.TileContainer.numberOfColumns)
        
        let bigTileWidth = containerWidth - smallTileWidth - Constants.TileContainer.horizontalSpacing
        
        return Sizes(screenSize: geo.size,
                     containerWidth: containerWidth,
                     smallTileWidth: smallTileWidth,
                     mediumTileWidth: containerWidth,
                     bigTileWidth: bigTileWidth)
    }
}

// MARK: - Sections

struct MyDataSectionView: View {
    var sectionModel: HomeScreenSectionModel
    
    enum ContainerType {
        case largeLeft
        case row
        case largeRight
    }
    
    let containersConfig: [ContainerType] = [.largeLeft, .row, .largeRight, .row]
    
    var body: some View {
        VStack(alignment: .leading, spacing: Constants.TileContainer.verticalSpacing) {
            Text(sectionModel.title).fontWeight(.bold)
            ForEach(Array(sectionModel.cards.chunked(into: Constants.TileContainer.numberOfColumns).enumerated()),
                    id: \.offset) { index, chunk in
                let type = containersConfig[index % containersConfig.count]
                switch type {
                case .largeLeft:
                    LargeLeftContainerView(cards: chunk)
                case .row:
                    RowContainerView(cards: chunk)
                case .largeRight:
                    LargeRightContainerView(cards: chunk)
                }
            }
        }
    }
}

struct DataKnowHowSectionView: View {
    let sectionModel: HomeScreenSectionModel

    var body: some View {
        VStack(alignment: .leading) {
            Text(sectionModel.title).fontWeight(.bold)
            VStack(alignment: .leading, spacing: Constants.TileContainer.verticalSpacing) {
                ForEach(Array(sectionModel.cards.chunked(into: Constants.TileContainer.numberOfColumns).enumerated()), id: \.offset) { _, chunk in
                    RowContainerView(cards: chunk)
                }
            }
        }
    }
}

struct OtherSectionView: View {
    let sectionModel: HomeScreenSectionModel

    var body: some View {
        VStack(alignment: .leading) {
            Text(sectionModel.title).fontWeight(.bold)
            VStack(alignment: .leading, spacing: Constants.TileContainer.verticalSpacing) {
                ForEach(Array(sectionModel.cards.chunked(into: Constants.TileContainer.numberOfColumns).enumerated()), id: \.offset) { _, chunk in
                    RowContainerView(cards: chunk)
                }
            }
        }
    }
}

struct ToolsSectionView: View {
    let sectionModel: HomeScreenSectionModel

    var body: some View {
        VStack(alignment: .leading) {
            Text(sectionModel.title).fontWeight(.bold)
            VStack(alignment: .leading, spacing: Constants.TileContainer.verticalSpacing) {
                ForEach(sectionModel.cards) { card in
                    MediumCardView(card: card)
                }
            }
        }
    }
}

// MARK: - Containers

struct LargeLeftContainerView: View {
    let cards: [Card]
    
    var body: some View {
        HStack(alignment: .top, spacing: Constants.TileContainer.horizontalSpacing) {
            BigCardView(card: cards.first!)
            VStack(spacing: Constants.TileContainer.verticalSpacing) {
                ForEach(Array(cards.dropFirst())) { card in
                    SmallCardView(card: card)
                }
            }
        }
    }
}

struct LargeRightContainerView: View {
    let cards: [Card]
    var body: some View {
        HStack(spacing: Constants.TileContainer.horizontalSpacing) {
            if cards.count < Constants.TileContainer.numberOfColumns {
                ForEach(cards) { card in
                    SmallCardView(card: card)
                }
            } else {
                VStack(spacing: Constants.TileContainer.verticalSpacing) {
                    ForEach(Array(cards.prefix(Constants.TileContainer.numberOfColumns - 1))) { card in
                        SmallCardView(card: card)
                    }
                }
                BigCardView(card: cards.last!)
            }
        }
    }
}

struct RowContainerView: View {
    let cards: [Card]
    var body: some View {
        HStack(alignment: .top, spacing: Constants.TileContainer.horizontalSpacing) {
            ForEach(cards) { card in
                SmallCardView(card: card)
            }
            if (cards.count < Constants.TileContainer.numberOfColumns) {
                Spacer()
            }
        }
    }
}

// MARK: - Cards

struct BigCardView: View {

    @Environment(\.homeScreenTileSizes) var sizes

    let card: Card
    private let foregroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.foregroundColor = card.backgroundColor.isLight ? .black : .white
    }

    var body: some View {
        VStack(alignment: .leading, spacing: Constants.Tile.verticalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: sizes.bigTileWidth - 2 * Constants.Tile.padding, alignment: .center)
            
            VStack(alignment: .leading, spacing: Constants.Tile.verticalSpacing) {
                Text(card.title)
                    .foregroundColor(foregroundColor)
                    .fontWeight(.bold)
                Text(card.description)
                    .foregroundColor(foregroundColor)
            }
        }
        .padding(Constants.Tile.padding)
        .frame(width: sizes.bigTileWidth,
               height: sizes.bigTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
    }
}

struct MediumCardView: View {
    @Environment(\.homeScreenTileSizes) var sizes

    let card: Card
    private let foregroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.foregroundColor = card.backgroundColor.isLight ? .black : .white
    }
    
    var body: some View {
        HStack(spacing: Constants.Tile.horizontalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: sizes.smallTileWidth - 2 * Constants.Tile.padding, height: sizes.smallTileWidth - 2 * Constants.Tile.padding, alignment: .center)
            
            VStack(alignment: .leading, spacing: Constants.Tile.verticalSpacing) {
                Text(card.title)
                    .foregroundColor(foregroundColor)
                    .fontWeight(.bold)
                Text(card.description)
                    .foregroundColor(foregroundColor)
            }
            Spacer()
        }
        .padding(Constants.Tile.padding)
        .frame(width: sizes.mediumTileWidth, height: sizes.smallTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
    }
}

struct SmallCardView: View {
    @Environment(\.homeScreenTileSizes) var sizes

    let card: Card
    private let foregroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.foregroundColor = card.backgroundColor.isLight ? .black : .white
    }

    var body: some View {
        VStack(alignment: .center, spacing: Constants.Tile.verticalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
            Text(card.title)
                .foregroundColor(foregroundColor)
                .fontWeight(.bold)
                .multilineTextAlignment(.center)
        }
        .padding(Constants.Tile.padding)
        .frame(width: sizes.smallTileWidth, height: sizes.smallTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
    }
}

struct FooterView: View {
    let model: FooterViewModel
    
    var body: some View {
        VStack(alignment: .leading, spacing: Constants.Tile.verticalSpacing) {
            Text(model.title).fontWeight(.bold)
            Text(model.description)
            Image(model.imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(alignment: .center)
            Button(model.buttonTitle) {
                //TODO
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .center)
            .foregroundColor(model.buttonBackgroundColor.isLight ? .black : .white)
            .background(model.buttonBackgroundColor)
            .cornerRadius(Constants.Tile.cornerRadius)
                
        }
        .padding(Constants.Tile.padding)
        .background(model.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
    }
}

// MARK: - Preview

struct HomeScreenView_Previews: PreviewProvider {
    static let categories: [HomeScreenSectionModel] = [
        .init(title: "Your Data",
              cards: [
                .init(id: UUID().uuidString,
                      title: "polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString, title: "Amazon Importer",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString, title: "Amazon Importer",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString, title: "Amazon Importer",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString,
                      title: "Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue),
                .init(id: UUID().uuidString, title: "Amazon Importer",
                      description: "nada",
                      image: UIImage(named: "FacebookImport")!,
                      backgroundColor: .blue)
              ],
              type: .yourData)
    ]

    class MockStorage: HomeScreenStorage {
        var categoriesList: AnyPublisher<[HomeScreenSectionModel], Never> = Just(categories).eraseToAnyPublisher()
    }
    
    static var previews: some View {
        
        HomeScreenView(viewModel:
                .init(storage: MockStorage()))
    }
}
