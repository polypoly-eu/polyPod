// swiftlint:disable file_length

import Combine
import PolyPodCoreSwift
import SwiftUI

// MARK: - Model

struct Card: Identifiable {
    let id: String
    let title: String
    let description: String
    let image: UIImage
    let backgroundColor: Color
    let borderColor: Color
    let tileTextColor: Color
}

struct HomeScreenSectionModel {
    let title: String
    let cards: [Card]
    let type: FeatureCategoryId
}

struct FooterViewModel {
    let title: LocalizedStringKey
    let description: LocalizedStringKey
    let backgroundColor: Color
    let buttonTitle: LocalizedStringKey
    let buttonBackgroundColor: Color

    var buttonOpenURL: URL {
        return URL(
            string:
                LocalizedStringKey(
                    "homescreen_footer_button_open_url"
                ) .toLocalizedString()
        )!
    }
}

protocol HomeScreenStorage {
    var categoriesList: AnyPublisher<[HomeScreenSectionModel], Never> { get }
}

final class HomeScreenStorageAdapter: HomeScreenStorage {
    let categoriesList: AnyPublisher<[HomeScreenSectionModel], Never>
    let featureStorage: FeatureStorage

    init(featureStorage: FeatureStorage) {
        self.featureStorage = featureStorage
        self.categoriesList = featureStorage
            .categoriesList
            .map(Self.mapCategoryModel)
            .eraseToAnyPublisher()
    }

    static func mapCategoryModel(_ categoryModels: [FeatureCategory]) -> [HomeScreenSectionModel] {
        categoryModels.map { model in
            HomeScreenSectionModel(title: model.name,
                                   cards: mapToCards(model.features),
                                   type: model.id)
        }
    }

    private static func mapToCards(_ features: [Feature]) -> [Card] {
        features.map { feature in

            let image: UIImage

            if feature.thumbnail?.isPDF() == true {
                image = UIImage.fromPDF(url: feature.thumbnail) ?? UIImage()
            } else if feature.thumbnail?.isPNG() == true {
                image = UIImage(contentsOfFile: feature.thumbnail?.path ?? "") ?? UIImage()
            } else {
                image = UIImage()
            }

            return Card(
                id: feature.id,
                title: feature.name,
                description: feature.description ?? "",
                image: image,
                backgroundColor: Color(fromHex: feature.thumbnailColor),
                borderColor: Color(fromHex: feature.borderColor),
                tileTextColor: Color(fromHex: feature.tileTextColor)
            )
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

extension UIFont {
    convenience init(name: String, size: CGFloat, weight: UIFont.Weight) {
        var fontDescriptor = UIFontDescriptor(name: name, size: size)
        fontDescriptor = fontDescriptor.addingAttributes(
            [UIFontDescriptor.AttributeName.traits: [UIFontDescriptor.TraitKey.weight: weight]]
        )
        self.init(descriptor: fontDescriptor, size: size)
    }
}

struct HomeScreenConstants {

    static let lineHeightMultiple: CGFloat = 0.83 

    struct Typography {
        let font: UIFont 
        let alignment: NSTextAlignment
    }

    struct Section {
        static let verticalSpacing = PolyStyle.Spacing.plSpace8x
        static let title = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostMedium,
                size: PolyStyle.Font.Size.lg,
                weight: PolyStyle.Font.Weight.medium
            ),
            alignment: PolyStyle.Font.Alignment.left
        )
    }

    struct View {
        static let horizontalPadding = PolyStyle.Spacing.plSpace4x
        static let backgroundColor = Color.init(fromHex: "#edf2f7")
    }

    struct TileContainer {
        static let verticalSpacing = PolyStyle.Spacing.plSpace3x
        static let horizontalSpacing = PolyStyle.Spacing.plSpace3x
        static let numberOfColumns = 3
    }

    struct Tile {
        static let cornerRadius = PolyStyle.Spacing.plSpace2x
        static let borderSize = PolyStyle.Border.plBorder1x
    }

    struct SmallTile {
        static let topPadding = 0.0
        static let otherPadding = PolyStyle.Spacing.plSpace2x
        static let title = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostMedium,
                size: PolyStyle.Font.Size.xs,
                weight: PolyStyle.Font.Weight.medium
            ),
            alignment: PolyStyle.Font.Alignment.center
        )
    }

    struct MediumTile {
        static let horizontalSpacing = PolyStyle.Spacing.plSpace3x
        static let textVerticalSpacing = PolyStyle.Spacing.plSpace2x
        static let textTopBottomPadding = PolyStyle.Spacing.plSpace2x
        static let textTrailingPadding = PolyStyle.Spacing.plSpace4x

        static let title = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostMedium,
                size: PolyStyle.Font.Size.base,
                weight: PolyStyle.Font.Weight.medium
            ),
            alignment: PolyStyle.Font.Alignment.left
        )
        static let description = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostRegular,
                size: PolyStyle.Font.Size.xs,
                weight: PolyStyle.Font.Weight.regular
            ),
            alignment: PolyStyle.Font.Alignment.left
        )
    }

    struct BigTile {
        static let padding = PolyStyle.Spacing.plSpace3x
        static let verticalSpacing = PolyStyle.Spacing.plSpace2x
        static let textVerticalSpacing = PolyStyle.Spacing.plSpace2x

        static let title = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostMedium,
                size: PolyStyle.Font.Size.base,
                weight: PolyStyle.Font.Weight.medium
            ),
            alignment: PolyStyle.Font.Alignment.left
        )
        static let description = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostRegular,
                size: PolyStyle.Font.Size.xs,
                weight: UIFont.Weight.regular
            ),
            alignment: PolyStyle.Font.Alignment.left
        )
    }

    struct Footer {
        static let verticalSpacing = PolyStyle.Spacing.plSpace4x
        static let padding = PolyStyle.Spacing.plSpace6x

        static let title = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostMedium,
                size: PolyStyle.Font.Size._2xl,
                weight: PolyStyle.Font.Weight.medium
            ),
            alignment: PolyStyle.Font.Alignment.left
        )

        static let description = Typography(
            font: .init(
                name: PolyStyle.Font.Family.jostRegular,
                size: PolyStyle.Font.Size.base,
                weight: UIFont.Weight.regular
            ),
            alignment: PolyStyle.Font.Alignment.left
        )

        // swiftlint:disable nesting
        struct Button {
            // swiftlint:enable nesting

            static let title = Typography(
                font: .init(
                    name: PolyStyle.Font.Family.jostMedium,
                    size: PolyStyle.Font.Size.lg,
                    weight: PolyStyle.Font.Weight.medium
                ),
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
    static let defaultValue: Sizes = Sizes(screenSize: .zero,
                                           containerWidth: .zero,
                                           smallTileWidth: .zero,
                                           mediumTileWidth: .zero,
                                           bigTileWidth: .zero
    )
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

typealias OnFeatureSelected = (String) -> Void
struct HomeScreenView: View {

    let footerModel = FooterViewModel(
        title: "homescreen_footer_title",
        description: "homescreen_footer_description",
        backgroundColor: Color(fromHex: "#fed7d6"),
        buttonTitle: "homescreen_footer_button_title",
        buttonBackgroundColor: Color(fromHex: "#0f1938")
    )

    @ObservedObject var viewModel: HomeScreenViewModel
    var openFeatureAction: OnFeatureSelected = { _ in }
    var openInfoAction: () -> Void = {}

    var body: some View {
        // Why GeometryReader needs to be on top?
        GeometryReader { geo in
            NavigationView {
                VStack(spacing: 0) {
                    Divider()
                    ScrollView(showsIndicators: false) {
                        Spacer(minLength: HomeScreenConstants.Section.verticalSpacing)
                        ForEach(viewModel.sections, id: \.type) { sectionModel in
                            switch sectionModel.type {
                            case .yourData:
                                MyDataSectionView(sectionModel: sectionModel)
                            case .knowHow:
                                DataKnowHowSectionView(sectionModel: sectionModel)
                            case .tools:
                                ToolsSectionView(sectionModel: sectionModel)
                            case .developer:
                                DeveloperSectionView(sectionModel: sectionModel)
                            }
                            Spacer(minLength: HomeScreenConstants.Section.verticalSpacing)
                        }
                        FooterView(model: footerModel)
                    }
                    .padding([.leading, .trailing], HomeScreenConstants.View.horizontalPadding)
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
                            NavigationLink {
                                SettingsView()
                            } label: {
                                Image("NavIconSettingsDark")
                                    .renderingMode(.original)
                            }
                        }
                    }
                }
                .background(HomeScreenConstants.View.backgroundColor)
            }
        }.onAppear {
            viewModel.setup()
        }.accessibilityIdentifier("homescreen_view")
    }

    func calculateSize(_ geo: GeometryProxy) -> Sizes {
        let screenWidth = geo.size.width

        let totalScreenPadding = 2 * HomeScreenConstants.View.horizontalPadding
        let containerWidth: CGFloat = screenWidth - totalScreenPadding

        let interItemSpacing =
            (Double(HomeScreenConstants.TileContainer.numberOfColumns) - 1.0) *
            HomeScreenConstants.TileContainer.horizontalSpacing
        let smallTileWidth: CGFloat =
            (containerWidth - interItemSpacing) / Double(HomeScreenConstants.TileContainer.numberOfColumns)

        let bigTileWidth = containerWidth - smallTileWidth - HomeScreenConstants.TileContainer.horizontalSpacing

        return Sizes(screenSize: geo.size,
                     containerWidth: containerWidth,
                     smallTileWidth: smallTileWidth,
                     mediumTileWidth: containerWidth,
                     bigTileWidth: bigTileWidth
        )
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
        VStack(alignment: .leading, spacing: HomeScreenConstants.TileContainer.verticalSpacing) {
            ParagraphView(
                text: sectionModel.title,
                font: HomeScreenConstants.Section.title.font,
                lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                textAlignment: HomeScreenConstants.Section.title.alignment
            )
            ForEach(
                Array(
                    sectionModel.cards.chunked(into: HomeScreenConstants.TileContainer.numberOfColumns).enumerated()
                ),
                id: \.offset
            ) { index, chunk in
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
            ParagraphView(
                text: sectionModel.title,
                font: HomeScreenConstants.Section.title.font,
                lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                textAlignment: HomeScreenConstants.Section.title.alignment)
            VStack(alignment: .leading, spacing: HomeScreenConstants.TileContainer.verticalSpacing) {
                ForEach(
                    Array(
                        sectionModel.cards.chunked(into: HomeScreenConstants.TileContainer.numberOfColumns).enumerated()
                    ),
                    id: \.offset
                ) { _, chunk in
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
            ParagraphView(
                text: sectionModel.title,
                font: HomeScreenConstants.Section.title.font,
                lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                textAlignment: HomeScreenConstants.Section.title.alignment)
            VStack(alignment: .leading, spacing: HomeScreenConstants.TileContainer.verticalSpacing) {
                ForEach(sectionModel.cards) { card in
                    MediumCardView(card: card)
                }
            }
        }
    }
}

struct DeveloperSectionView: View {
    let sectionModel: HomeScreenSectionModel

    var body: some View {
        VStack(alignment: .leading) {
            Text(sectionModel.title).fontWeight(.bold)
            VStack(alignment: .leading, spacing: HomeScreenConstants.TileContainer.verticalSpacing) {
                ForEach(sectionModel.cards) { card in
                    MediumCardView(card: card)
                        .accessibilityElement()
                        .accessibilityIdentifier("\(card.id)_feature")
                }
            }
        }
    }
}

// MARK: - Containers

struct LargeLeftContainerView: View {
    let cards: [Card]

    var body: some View {
        HStack(alignment: .top, spacing: HomeScreenConstants.TileContainer.horizontalSpacing) {
            BigCardView(card: cards.first!)
            VStack(spacing: HomeScreenConstants.TileContainer.verticalSpacing) {
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
        HStack(spacing: HomeScreenConstants.TileContainer.horizontalSpacing) {
            if cards.count < HomeScreenConstants.TileContainer.numberOfColumns {
                ForEach(cards) { card in
                    SmallCardView(card: card)
                }
            } else {
                VStack(spacing: HomeScreenConstants.TileContainer.verticalSpacing) {
                    ForEach(Array(cards.prefix(HomeScreenConstants.TileContainer.numberOfColumns - 1))) { card in
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
        HStack(alignment: .top, spacing: HomeScreenConstants.TileContainer.horizontalSpacing) {
            ForEach(cards) { card in
                SmallCardView(card: card)
            }
            if cards.count < HomeScreenConstants.TileContainer.numberOfColumns {
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

    var body: some View {
        VStack(alignment: .leading, spacing: HomeScreenConstants.BigTile.verticalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: sizes.bigTileWidth - 2 * HomeScreenConstants.BigTile.padding, alignment: .center)

            VStack(alignment: .leading, spacing: HomeScreenConstants.BigTile.textVerticalSpacing) {
                ParagraphView(
                    text: card.title,
                    font: HomeScreenConstants.BigTile.title.font,
                    lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                    foregroundColor: card.tileTextColor,
                    textAlignment: HomeScreenConstants.BigTile.title.alignment)
                ParagraphView(
                    text: card.description,
                    font: HomeScreenConstants.BigTile.description.font,
                    lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                    foregroundColor: card.tileTextColor,
                    textAlignment: HomeScreenConstants.BigTile.description.alignment
                )
            }
        }
        .padding(HomeScreenConstants.BigTile.padding)
        .frame(width: sizes.bigTileWidth,
               height: sizes.bigTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(HomeScreenConstants.Tile.cornerRadius)
        .overlay(
            RoundedRectangle(cornerRadius: HomeScreenConstants.Tile.cornerRadius)
                .stroke(
                    card.borderColor,
                    lineWidth: HomeScreenConstants.Tile.borderSize
                )
        )
        .onTapGesture {
            onFeatureSelected(card.id)
        }
        .accessibilityElement()
        .accessibilityIdentifier("feature_tile_view")
    }
}

struct MediumCardView: View {
    @Environment(\.homeScreenTileSizes) var sizes
    @Environment(\.homeScreenFeatureSelected) var onFeatureSelected

    let card: Card

    var body: some View {
        HStack(spacing: HomeScreenConstants.MediumTile.horizontalSpacing) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: sizes.smallTileWidth,
                       height: sizes.smallTileWidth,
                       alignment: .center)
            VStack(alignment: .leading, spacing: HomeScreenConstants.MediumTile.textVerticalSpacing) {
                ParagraphView(
                    text: card.title,
                    font: HomeScreenConstants.MediumTile.title.font,
                    lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                    foregroundColor: card.tileTextColor,
                    textAlignment: HomeScreenConstants.MediumTile.title.alignment)
                ParagraphView(
                    text: card.description,
                    font: HomeScreenConstants.MediumTile.description.font,
                    lineHeightMultiple: HomeScreenConstants.lineHeightMultiple, 
                    foregroundColor: card.tileTextColor,
                    textAlignment: HomeScreenConstants.MediumTile.description.alignment
                )
            }
            .padding([.top, .bottom], HomeScreenConstants.MediumTile.textTopBottomPadding)
            .padding([.trailing], HomeScreenConstants.MediumTile.textTrailingPadding)
            Spacer(minLength: 0.0)
        }
        .frame(width: sizes.mediumTileWidth, height: sizes.smallTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(HomeScreenConstants.Tile.cornerRadius)
        .overlay(
            RoundedRectangle(cornerRadius: HomeScreenConstants.Tile.cornerRadius)
                .stroke(
                    card.borderColor,
                    lineWidth: HomeScreenConstants.Tile.borderSize
                )
        )
        .onTapGesture {
            onFeatureSelected(card.id)
        }
        .accessibilityElement()
        .accessibilityIdentifier("feature_tile_view")
    }
}

struct SmallCardView: View {
    @Environment(\.homeScreenTileSizes) var sizes
    @Environment(\.homeScreenFeatureSelected) var onFeatureSelected

    let card: Card

    var body: some View {
        VStack(alignment: .center) {
            Image(uiImage: card.image)
                .resizable()
                .aspectRatio(contentMode: .fit)
            Spacer()
            ParagraphView(
                text: card.title,
                font: HomeScreenConstants.SmallTile.title.font,
                lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                foregroundColor: card.tileTextColor,
                textAlignment: HomeScreenConstants.SmallTile.title.alignment
            )
        }
        .padding([.leading, .trailing, .bottom], HomeScreenConstants.SmallTile.otherPadding)
        .padding([.top], HomeScreenConstants.SmallTile.topPadding)
        .frame(width: sizes.smallTileWidth, height: sizes.smallTileWidth)
        .background(card.backgroundColor)
        .cornerRadius(HomeScreenConstants.Tile.cornerRadius)
        .overlay(
            RoundedRectangle(cornerRadius: HomeScreenConstants.Tile.cornerRadius)
                .stroke(
                    card.borderColor,
                    lineWidth: HomeScreenConstants.Tile.borderSize
                )
        )
        .onTapGesture {
            onFeatureSelected(card.id)
        }
        .accessibilityElement()
        .accessibilityIdentifier("feature_tile_view")
    }
}

struct FooterView: View {
    let model: FooterViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: HomeScreenConstants.Footer.verticalSpacing) {
            ParagraphView(
                text: model.title,
                font: HomeScreenConstants.Footer.title.font,
                lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                textAlignment: HomeScreenConstants.Footer.title.alignment
            )
            ParagraphView(
                text: model.description,
                font: HomeScreenConstants.Footer.description.font,
                lineHeightMultiple: HomeScreenConstants.lineHeightMultiple,
                textAlignment: HomeScreenConstants.Footer.description.alignment
            )
            
            Button(model.buttonTitle) {
                UIApplication.shared.open(model.buttonOpenURL)
            }
            .padding()
            .frame(maxWidth: .infinity, alignment: .center)
            .foregroundColor(.white)
            .font(Font(HomeScreenConstants.Footer.Button.title.font as CTFont))
            .background(model.buttonBackgroundColor)
            .cornerRadius(HomeScreenConstants.Tile.cornerRadius)

        }
        .padding(HomeScreenConstants.Footer.padding)
        .background(model.backgroundColor)
        .cornerRadius(HomeScreenConstants.Tile.cornerRadius)
    }
}

// MARK: - Preview

struct HomeScreenView_Previews: PreviewProvider {
    static let categories: [HomeScreenSectionModel] = [
        .init(title: "Your Data",
              cards: [
                .init(id: UUID().uuidString,
                      title: "1 polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                ),
                .init(
                    id: UUID().uuidString,
                    title: "2 Big big many big hello there",
                    description: "nada",
                    image: UIImage(named: "AppIcon")!,
                    backgroundColor: .blue,
                    borderColor: .red,
                    tileTextColor: .white
                ),
                .init(
                    id: UUID().uuidString,
                    title: "3 Amazon Importer",
                    description: "nada",
                    image: UIImage(named: "AppIcon")!,
                    backgroundColor: .blue,
                    borderColor: .red,
                    tileTextColor: .white
                ),
                .init(
                    id: UUID().uuidString,
                    title: "4 polyExplorer",
                    description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                    image: UIImage(named: "AppIcon")!,
                    backgroundColor: .blue,
                    borderColor: .red,
                    tileTextColor: .white
                ),
                .init(id: UUID().uuidString,
                      title: "5 Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                ),
                .init(id: UUID().uuidString,
                      title: "6 Amazon Importer",
                      description: "nada",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                ),
                .init(id: UUID().uuidString,
                      title: "7 polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                )
              ],
              type: .yourData),
        .init(title: "Data Know-How",
              cards: [
                .init(id: UUID().uuidString,
                      title: "polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                ),
                .init(id: UUID().uuidString,
                      title: "Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                )
              ],
              type: .knowHow),
        .init(title: "Tools",
              cards: [
                .init(id: UUID().uuidString,
                      title: "polyExplorer",
                      description: "asdasd asd qwida sdiubwd aid wiuda daiuwd asuidbwad asiudwida diuw",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                ),
                .init(id: UUID().uuidString,
                      title: "Big big many big hello there",
                      description: "nada",
                      image: UIImage(named: "AppIcon")!,
                      backgroundColor: .blue,
                      borderColor: .red,
                      tileTextColor: .white
                )
              ],
              type: .tools)
    ]

    class MockStorage: HomeScreenStorage {
        var categoriesList: AnyPublisher<[HomeScreenSectionModel], Never> = Just(categories).eraseToAnyPublisher()
    }

    static var previews: some View {
        HomeScreenView(viewModel: .init(storage: MockStorage()))
    }
}
