import Foundation
import PolyPodCore
import FlatBuffers

@dynamicMemberLookup
/// A wrapper class used to manage the lifetime of the Flatbuffer memory.
/// It will make sure to deallocate the memory once the model is no more used.
public final class FBObject<FBModel> {
    /// The bytes storage for the fbModel
    private let rawPointer: UnsafeMutableRawPointer
    /// The underlying flatbuffer model.
    private let fbModel: FBModel
    
    init(rawPointer: UnsafeMutableRawPointer, fbModel: FBModel) {
        self.rawPointer = rawPointer
        self.fbModel = fbModel
    }
    
    convenience init(_ byteByffer: ByteBuffer, _ fbModel: FBModel) {
        self.init(rawPointer: byteByffer.memory, fbModel: fbModel)
    }
    
    deinit {
        free_bytes(rawPointer)
    }
    
    public subscript<T>(dynamicMember keyPath: KeyPath<FBModel, T>) -> T {
        fbModel[keyPath: keyPath]
    }
}

extension FBObject where FBModel == FeatureManifest {
    public func links(at index: Int32) -> Link? {
        fbModel.links(at: index)
    }
}
