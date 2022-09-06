use common::serialization::message_pack_deserialize;
use core_failure::CoreFailure;
use serde::{de::DeserializeOwned, Serialize};

use crate::core::Core;

pub trait PlatformHookRequest: Sync + Send {
    fn perform_request(&self, request: PlatformRequest) -> Vec<u8>;
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
        message_pack_deserialize(self.platform_hook.perform_request(request))
    }
}
