use url::Url;

use crate::common::serialization::{message_pack_deserialize, message_pack_serialize};
use crate::core_failure::CoreFailure;
use crate::feature_file_system::ResourceUrl;
use std::ffi::CStr;
use std::os::raw::c_uint;
extern crate rmp_serde;
use crate::core::{self, PlatformRequest, PlatformResponse};
use std::os::raw::c_char;

/// # Safety
/// This function can be unsafe if the language_code pointer is null or the string is in wrong format.
///
/// Mention - It is needed to be tested in integration if `*const u8` is the appropriate return format.
///           Also, most likely, it will be required to expose an API to deallocate the byte buffer after parsing.
///
/// Bootstrap core with the given configuration:
/// - language_code: User's locale language code.
/// Returns a flatbuffer byte array with core_bootstrap_response.
#[no_mangle]
pub unsafe extern "C" fn core_bootstrap(
    language_code: *const c_char,
    fs_root: *const c_char,
    bridge: BridgeToPlatform,
) -> CByteBuffer {
    fn bootstrap(
        language_code: *const c_char,
        fs_root: *const c_char,
        bridge: BridgeToPlatform,
    ) -> Result<(), CoreFailure> {
        unsafe {
            let language_code = String::from(cstring_to_str(&language_code)?);
            let fs_root = String::from(cstring_to_str(&fs_root)?);
            core::bootstrap(language_code, fs_root, Box::new(bridge))
        }
    }
    create_byte_buffer(message_pack_serialize(bootstrap(
        language_code,
        fs_root,
        bridge,
    )))
}

/// # Safety
/// This function can be unsafe if the features_dir pointer is null or the string is in wrong format.
///
/// Loads the feature categories from from the given features_dir.
/// - features_dir: Path to directory where feature categories are stored.
/// Returns Result<Vec<FeatureCategory>, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn load_feature_categories(features_dir: *const c_char) -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        cstring_to_str(&features_dir).and_then(core::load_feature_categories),
    ))
}

/// Notify that app did become inactive.
/// Returns Result<(), CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn app_did_become_inactive() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(core::app_did_become_inactive()))
}

/// Ask if user session is expired.
/// Returns Result<bool, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn is_user_session_expired() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(core::is_user_session_expired()))
}

/// Set the user session timeout option to a given one.
/// - option: Timeout Option as MessagePack value.
/// - free_bytes: A callback function to be used to free bytes.
/// Returns Result<(), CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn set_user_session_timeout_option(
    option: CByteBuffer,
    free_bytes: extern "C" fn(bytes: *mut u8),
) -> CByteBuffer {
    fn set_timeout_option(
        option: CByteBuffer,
        free_bytes: extern "C" fn(bytes: *mut u8),
    ) -> Result<(), CoreFailure> {
        let bytes = unsafe { byte_buffer_to_bytes(&option)? };
        free_bytes(option.data);
        core::set_user_session_timeout_option(message_pack_deserialize(bytes)?)?;
        Ok(())
    }
    create_byte_buffer(message_pack_serialize(set_timeout_option(
        option, free_bytes,
    )))
}

/// Get the currently configured user session timeout option.
/// Returns Result<TimeoutOption, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn get_user_session_timeout_option() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        core::get_user_session_timeout_option(),
    ))
}

/// Get the user session timeout config options.
/// Returns Result<Vec<UserSessionTimeout>, CoreFailure> as MessagePack value.
#[no_mangle]
pub unsafe extern "C" fn get_user_session_timeout_options_config() -> CByteBuffer {
    create_byte_buffer(message_pack_serialize(
        core::get_user_session_timeout_options_config(),
    ))
}

/// Imports an archive
/// dest_resource_url is optional. Pass an empty string if you don't want to pass a value for it.
#[no_mangle]
pub unsafe extern "C" fn import_archive(
    url: *const c_char,
    dest_resource_url: *const c_char,
    feature_name: *const c_char,
) -> CByteBuffer {
    fn internal(
        url: *const c_char,
        dest_resource_url: *const c_char,
        feature_name: *const c_char,
    ) -> Result<ResourceUrl, CoreFailure> {
        unsafe {
            let url_str = cstring_to_str(&url)?;
            let url = Url::parse(url_str).map_err(|err| {
                CoreFailure::failed_to_parse_url(url_str.to_owned(), err.to_string())
            })?;
            let dest_resource_url_str = cstring_to_str(&dest_resource_url)?;
            let dest_resource_url = if dest_resource_url_str == "" {
                None
            } else {
                Some(String::from(dest_resource_url_str))
            };
            let feature_name = String::from(cstring_to_str(&feature_name)?);
            core::import_archive(url, dest_resource_url, feature_name)
        }
    }
    create_byte_buffer(message_pack_serialize(internal(
        url,
        dest_resource_url,
        feature_name,
    )))
}

/*
pub fn import_archive(
    url: &Url,
    dest_resource_url: Option<ResourceUrl>,
    feature_name: String,
) -> Result<ResourceUrl, CoreFailure> {
    let feature_folder_path = feature_folder_path(&feature_name)?;
    // TODO: Filesystem should be passed from outside. Maybe the core should keep an instance of this.
    let platform_fs = DefaultFileSystem {};
    feature_file_system::import_archive(url, dest_resource_url, &platform_fs, &feature_folder_path)
}

pub fn write_file(
    url: &Url,
    dest_resource_url: Option<ResourceUrl>,
    feature_name: String,
) -> Result<ResourceUrl, CoreFailure> {
    let feature_folder_path = feature_folder_path(&feature_name)?;
    let platform_fs = DefaultFileSystem {};
    feature_file_system::write_file(url, dest_resource_url, &platform_fs, &feature_folder_path)
}

pub fn metadata(resource_url: &ResourceUrl, feature_name: String) -> Result<Metadata, CoreFailure> {
    let feature_folder_path = feature_folder_path(&feature_name)?;
    let platform_fs = DefaultFileSystem {};
    feature_file_system::metadata(resource_url, &platform_fs, &feature_folder_path)
}

pub fn read_dir(
    resource_url: &ResourceUrl,
    feature_name: String,
) -> Result<Vec<String>, CoreFailure> {
    let feature_folder_path = feature_folder_path(&feature_name)?;
    let platform_fs = DefaultFileSystem {};
    feature_file_system::read_dir(resource_url, &platform_fs, &feature_folder_path)
}

pub fn read_file(resource_url: &ResourceUrl, feature_name: String) -> Result<Vec<u8>, CoreFailure> {
    let feature_folder_path = feature_folder_path(&feature_name)?;
    let platform_fs = DefaultFileSystem {};
    feature_file_system::read_file(resource_url, &platform_fs, &feature_folder_path)
}

pub fn remove(resource_url: &ResourceUrl, feature_name: String) -> Result<(), CoreFailure> {
    let feature_folder_path = feature_folder_path(&feature_name)?;
    let platform_fs = DefaultFileSystem {};
    feature_file_system::remove(resource_url, &platform_fs, &feature_folder_path)
} */

/// # Safety
/// This function can be unsafe if trying to deallocate invalid memory.
///
/// Drops the given bytes.
#[no_mangle]
pub unsafe extern "C" fn free_bytes(bytes: *mut u8) {
    drop(Box::from_raw(bytes))
}

// Disabled the clippy false positive, https://github.com/rust-lang/rust-clippy/issues/5787
#[allow(clippy::needless_lifetimes)]
unsafe fn cstring_to_str<'a>(cstring: &'a *const c_char) -> Result<&str, CoreFailure> {
    if cstring.is_null() {
        return Err(CoreFailure::null_c_string_pointer());
    }

    CStr::from_ptr(*cstring)
        .to_str()
        .map_err(|err| CoreFailure::failed_to_create_c_str(err.to_string()))
}

#[repr(C)]
pub struct CByteBuffer {
    pub length: c_uint,
    pub data: *mut u8,
}

unsafe fn create_byte_buffer(bytes: Vec<u8>) -> CByteBuffer {
    let slice = bytes.into_boxed_slice();
    CByteBuffer {
        length: slice.len() as c_uint,
        data: Box::into_raw(slice) as *mut u8,
    }
}

unsafe fn byte_buffer_to_bytes(buffer: &CByteBuffer) -> Result<Vec<u8>, CoreFailure> {
    let length: usize = buffer
        .length
        .try_into()
        .map_err(|_| CoreFailure::failed_to_read_byte_buffer_length())?;
    let slice = std::slice::from_raw_parts(buffer.data, length);
    Ok(slice.to_vec())
}

#[repr(C)]
pub struct BridgeToPlatform {
    free_bytes: extern "C" fn(bytes: *mut u8),
    perform_request: extern "C" fn(request: CByteBuffer) -> CByteBuffer,
}

impl core::PlatformHookRequest for BridgeToPlatform {
    fn perform_request(&self, request: PlatformRequest) -> Result<PlatformResponse, CoreFailure> {
        let request_byte_buffer = unsafe { create_byte_buffer(message_pack_serialize(request)) };
        let response_byte_buffer = (self.perform_request)(request_byte_buffer);
        let bytes = unsafe { byte_buffer_to_bytes(&response_byte_buffer)? };
        // deserialize returns Result<Result<PlatformResponse, String>>
        // so don't forget the ? at the end in the next line.
        let response: Result<PlatformResponse, CoreFailure> = message_pack_deserialize(bytes)?;
        (self.free_bytes)(response_byte_buffer.data);
        return response;
    }
}
