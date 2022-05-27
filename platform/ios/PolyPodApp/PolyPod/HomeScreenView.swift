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
    let type: FeaturesCategoryId
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
    
    static func mapCategoryModel(_ categoryModels: [FeaturesCategoryModel]) -> [HomeScreenSectionModel] {
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

struct PolyStyle {
    struct Spacing {
        static let plSpace1x = 4.0
        static let plSpace2x = {
            2 * Self.plSpace1x
        }()
        static let plSpace3x = {
            3 * Self.plSpace1x
        }()
        static let plSpace4x = {
            4 * Self.plSpace1x
        }()
        static let plSpace5x = {
            5 * Self.plSpace1x
        }()
        static let plSpace6x = {
            6 * Self.plSpace1x
        }()
        static let plSpace7x = {
            7 * Self.plSpace1x
        }()
        static let plSpace8x = {
            8 * Self.plSpace1x
        }()
    }
    
    struct Radius {
        static let plRadiusBase1x = 4.0
        static let plRadiusBase2x = {
            2 * Self.plRadiusBase1x
        }()
        static let plRadiusBase3x = {
            3 * Self.plRadiusBase1x
        }()
        static let plRadiusBase4x = {
            4 * Self.plRadiusBase1x
        }()
        static let plRadiusBase5x = {
            5 * Self.plRadiusBase1x
        }()
        static let plRadiusBase6x = {
            6 * Self.plRadiusBase1x
        }()
    }
    
    struct Font {
        struct Family {
            static let jostRegular = "Jost-Regular"
            static let jostMedium = "Jost-Medium"
        }
        
        struct Weight {
            static let regular = SwiftUI.Font.Weight.regular
            static let medium = SwiftUI.Font.Weight.medium
        }
        
        struct Size {
            static let xs = 12.0
            static let sm = 14.0
            static let base = 16.0
            static let lg = 18.0
            static let xl = 20.0
            static let _2xl = 22.0
        }
        
        struct Alignment {
            static let center: TextAlignment = .center
            static let left: TextAlignment = .leading
            static let right: TextAlignment = .trailing
        }
    }
}

struct Constants {
    
    struct Typography {
        let font: Font
        let alignment: TextAlignment
    }
    
    struct Section {
        static let verticalSpacing = PolyStyle.Spacing.plSpace8x
        static let title = Typography(font: .custom(PolyStyle.Font.Family.jostMedium,
                                                          size: PolyStyle.Font.Size.lg)
                                        .weight(PolyStyle.Font.Weight.medium),
                                      alignment: PolyStyle.Font.Alignment.left)
    }
    
    struct View {
        static let horizontalPadding = PolyStyle.Spacing.plSpace4x
    }
    
    struct TileContainer {
        static let verticalSpacing = PolyStyle.Spacing.plSpace3x
        static let horizontalSpacing = PolyStyle.Spacing.plSpace3x
        static let numberOfColumns = 3
    }
    
    struct Tile {
        static let cornerRadius = PolyStyle.Spacing.plSpace2x
    }
    
    struct SmallTile {
        static let topPadding = PolyStyle.Spacing.plSpace6x
        static let otherPadding = PolyStyle.Spacing.plSpace2x
        static let title = Typography(font: .custom(PolyStyle.Font.Family.jostMedium,
                                                    size: PolyStyle.Font.Size.xs)
                                        .weight(PolyStyle.Font.Weight.medium),
                                      alignment: PolyStyle.Font.Alignment.center)
    }
    
    struct MediumTile {
        static let horizontalSpacing = PolyStyle.Spacing.plSpace3x
        static let textVerticalSpacing = PolyStyle.Spacing.plSpace2x
        static let textTopBottomPadding = PolyStyle.Spacing.plSpace2x
        static let textTrailingPadding = PolyStyle.Spacing.plSpace4x
        
        static let title = Typography(font: .custom(PolyStyle.Font.Family.jostMedium,
                                                    size: PolyStyle.Font.Size.base)
                                        .weight(PolyStyle.Font.Weight.medium),
                                      alignment: PolyStyle.Font.Alignment.left)
        static let description = Typography(font: .custom(PolyStyle.Font.Family.jostRegular,
                                                          size: PolyStyle.Font.Size.xs)
                                                .weight(PolyStyle.Font.Weight.regular),
                                            alignment: PolyStyle.Font.Alignment.left)
    }
    
    struct BigTile {
        static let padding = PolyStyle.Spacing.plSpace3x
        static let verticalSpacing = PolyStyle.Spacing.plSpace2x
        static let textVerticalSpacing = PolyStyle.Spacing.plSpace2x
        
        static let title = Typography(font: .custom(PolyStyle.Font.Family.jostMedium,
                                                    size: PolyStyle.Font.Size.base)
                                        .weight(PolyStyle.Font.Weight.medium),
                                      alignment: PolyStyle.Font.Alignment.left)
        static let description = Typography(font: .custom(PolyStyle.Font.Family.jostRegular,
                                                          size: PolyStyle.Font.Size.xs)
                                                .weight(PolyStyle.Font.Weight.regular),
                                            alignment: PolyStyle.Font.Alignment.left)
    }
    
    struct Footer {
        static let verticalSpacing = PolyStyle.Spacing.plSpace4x
        static let padding = PolyStyle.Spacing.plSpace6x
        
        static let title = Typography(font: .custom(PolyStyle.Font.Family.jostMedium,
                                                    size: PolyStyle.Font.Size._2xl)
                                        .weight(PolyStyle.Font.Weight.medium),
                                      alignment: PolyStyle.Font.Alignment.left)
        static let description = Typography(font: .custom(PolyStyle.Font.Family.jostRegular,
                                                          size: PolyStyle.Font.Size.base)
                                                .weight(PolyStyle.Font.Weight.regular),
                                            alignment: PolyStyle.Font.Alignment.left)
        
        struct Button {
            static let title = Typography(font: .custom(PolyStyle.Font.Family.jostMedium,
                                                        size: PolyStyle.Font.Size.lg)
                                            .weight(PolyStyle.Font.Weight.medium),
                                          alignment: PolyStyle.Font.Alignment.center)
        }
    }
}

struct Sizes {
    let screenSize: CGSize
    let containerWidth: CGFloat
    let smallTileWidth: CGFloat
    let mediumTileWidth: CGFloat
    let bigTileWidth: CGFloat
}

struct HomeScreenFeatureSelectedKey: EnvironmentKey {
    typealias Value = OnFeatureSelected
    static let defaultValue: OnFeatureSelected = { _ in }
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
    
    var homeScreenFeatureSelected: OnFeatureSelected {
        get { self[HomeScreenFeatureSelectedKey.self] }
        set { self[HomeScreenFeatureSelectedKey.self] = newValue }
    }
}

// MARK: - Root View

typealias OnFeatureSelected = (FeatureId) -> Void
struct HomeScreenView: View {
    
    let footerModel = FooterViewModel(title: "Like what you have seen?",
                                      description: "Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo.",
                                      imageName: "FacebookImport",
                                      backgroundColor: Color(fromHex: "#fed7d6"),
                                      buttonTitle: "Learn more",
                                      buttonBackgroundColor: Color(fromHex: "#0f1938"))
    
    @ObservedObject var viewModel: HomeScreenViewModel
    var openFeatureAction: OnFeatureSelected = { _ in }
    var openInfoAction: () -> Void = {}
    var openSettingsAction: () -> Void = {}
    var openLearnMoreAction: () -> Void = { }
    
    var body: some View {
        // Why GeometryReader needs to be on top?
        GeometryReader { geo in
            NavigationView {
                VStack(spacing: 0) {
                    Divider()
                    ScrollView(showsIndicators: false) {
                        Spacer(minLength: Constants.Section.verticalSpacing)
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
                        FooterView(model: footerModel, openLearnMoreAction: openLearnMoreAction)
                    }
                    .padding([.leading, .trailing], Constants.View.horizontalPadding)
                    .environment(\.homeScreenTileSizes, calculateSize(geo))
                    .environment(\.homeScreenFeatureSelected, openFeatureAction)
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarLeading) {
                            Image("NavIconInfoDark")
                                .renderingMode(.original)
                                .onTapGesture(perform: openInfoAction)
                        }
                        
                        ToolbarItem(placement: .principal) {
                            Image("NavIconPolyPodLogo").renderingMode(.original)
                        }
                        
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Image("NavIconSettingsDark")
                                .renderingMode(.original)
                                .onTapGesture(perform: openSettingsAction)
                        }
                    }
                }
            }
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
            Text(sectionModel.title)
                .font(Constants.Section.title.font)
                .multilineTextAlignment(Constants.Section.title.alignment)
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
    @Environment(\.homeScreenFeatureSelected) var onFeatureSelected
    
    let card: Card
    private let foregroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.foregroundColor = card.backgroundColor.isLight ? .black : .white
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: Constants.BigTile.verticalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: sizes.bigTileWidth - 2 * Constants.BigTile.padding, alignment: .center)
            
            VStack(alignment: .leading, spacing: Constants.BigTile.textVerticalSpacing) {
                Text(card.title)
                    .foregroundColor(foregroundColor)
                    .font(Constants.BigTile.title.font)
                    .multilineTextAlignment(Constants.BigTile.title.alignment)
                Text(card.description)
                    .foregroundColor(foregroundColor)
                    .font(Constants.BigTile.description.font)
                    .multilineTextAlignment(Constants.BigTile.description.alignment)
            }
        }
        .padding(Constants.BigTile.padding)
        .frame(width: sizes.bigTileWidth,
               height: sizes.bigTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
        .onTapGesture {
            onFeatureSelected(card.id)
        }
    }
}

struct MediumCardView: View {
    @Environment(\.homeScreenTileSizes) var sizes
    @Environment(\.homeScreenFeatureSelected) var onFeatureSelected
    
    let card: Card
    private let foregroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.foregroundColor = card.backgroundColor.isLight ? .black : .white
    }
    
    var body: some View {
        HStack(spacing: Constants.MediumTile.horizontalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: sizes.smallTileWidth,
                       height: sizes.smallTileWidth,
                       alignment: .center)
            VStack(alignment: .leading, spacing: Constants.MediumTile.textVerticalSpacing) {
                Text(card.title)
                    .foregroundColor(foregroundColor)
                    .font(Constants.MediumTile.title.font)
                    .multilineTextAlignment(Constants.MediumTile.title.alignment)
                Text(card.description)
                    .foregroundColor(foregroundColor)
                    .font(Constants.MediumTile.description.font)
                    .multilineTextAlignment(Constants.MediumTile.description.alignment)
            }
            .padding([.top, .bottom], Constants.MediumTile.textTopBottomPadding)
            .padding([.trailing], Constants.MediumTile.textTrailingPadding)
            Spacer(minLength: 0.0)
        }
        .frame(width: sizes.mediumTileWidth, height: sizes.smallTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
        .onTapGesture {
            onFeatureSelected(card.id)
        }
    }
}

struct SmallCardView: View {
    @Environment(\.homeScreenTileSizes) var sizes
    @Environment(\.homeScreenFeatureSelected) var onFeatureSelected
    
    let card: Card
    private let foregroundColor: Color
    
    init(card: Card) {
        self.card = card
        self.foregroundColor = card.backgroundColor.isLight ? .black : .white
    }
    
    var body: some View {
        VStack(alignment: .center) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
            Spacer()
            Text(card.title)
                .foregroundColor(foregroundColor)
                .font(Constants.SmallTile.title.font)
                .multilineTextAlignment(Constants.SmallTile.title.alignment)
        }
        .padding([.leading, .trailing, .bottom], Constants.SmallTile.otherPadding)
        .padding([.top], Constants.SmallTile.topPadding)
        .frame(width: sizes.smallTileWidth, height: sizes.smallTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(Constants.Tile.cornerRadius)
        .onTapGesture {
            onFeatureSelected(card.id)
        }
    }
}

struct FooterView: View {
    let model: FooterViewModel
    var openLearnMoreAction: () -> Void = { }
    
    var body: some View {
        VStack(alignment: .leading, spacing: Constants.Footer.verticalSpacing) {
            Text(model.title)
                .font(Constants.Footer.title.font)
                .multilineTextAlignment(Constants.Footer.title.alignment)
            Text(model.description)
                .font(Constants.Footer.description.font)
                .multilineTextAlignment(Constants.Footer.description.alignment)
            Image(model.imageName)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(alignment: .center)
            Button(model.buttonTitle) {
                openLearnMoreAction()
            }
            .font(Constants.Footer.Button.title.font)
            .multilineTextAlignment(Constants.Footer.Button.title.alignment)
            .padding()
            .frame(maxWidth: .infinity, alignment: .center)
            .foregroundColor(model.buttonBackgroundColor.isLight ? .black : .white)
            .background(model.buttonBackgroundColor)
            .cornerRadius(Constants.Tile.cornerRadius)
            
        }
        .padding(Constants.Footer.padding)
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
              type: .tools)
    ]
    
    class MockStorage: HomeScreenStorage {
        var categoriesList: AnyPublisher<[HomeScreenSectionModel], Never> = Just(categories).eraseToAnyPublisher()
    }
    
    static var previews: some View {
        
        HomeScreenView(viewModel:
                .init(storage: MockStorage()))
    }
}
