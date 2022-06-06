import Foundation
import PolyPodCore
import FlatBuffers

@dynamicMemberLookup
/// A wrapper class used to manage the lifetime of the Flatbuffer memory.
/// It will make sure to deallocate the memory once the model is no more used.
public final class FlatbObject<FBModel> {
    /// The bytes storage for the fbModel
    private let rawPointer: UnsafeMutablePointer<UInt8>
    /// The underlying flatbuffer model.
    private let fbModel: FBModel
    
    init(_ rawPointer: UnsafeMutablePointer<UInt8>, _ fbModel: FBModel) {
        self.rawPointer = rawPointer
        self.fbModel = fbModel
    }
    
    deinit {
        free_bytes(rawPointer)
    }
    
    public subscript<T>(dynamicMember keyPath: KeyPath<FBModel, T>) -> T {
        fbModel[keyPath: keyPath]
    }
}

extension FlatbObject where FBModel == FeatureManifest {
    public func links(at index: Int32) -> Link? {
        fbModel.links(at: index)
    }
}
