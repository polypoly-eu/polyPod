use common::serialization::message_pack_deserialize;
use core_failure::CoreFailure;
use serde::{de::DeserializeOwned, Serialize};

use crate::core::Core;

pub trait PlatformCallback: Sync + Send {
    fn perform_request(&self, request: PlatformRequest) -> Result<Vec<u8>, CoreFailure>;
}

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub enum PlatformRequest {
    Example,
}

impl Core<'_> {
    pub fn send_platform_request<Response: DeserializeOwned>(
        &self,
        request: PlatformRequest,
    ) -> Result<Response, CoreFailure> {
        message_pack_deserialize(self.platform_callback.perform_request(request)?)
    }
}
