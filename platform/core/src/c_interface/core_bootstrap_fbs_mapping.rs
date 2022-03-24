use super::core_failure_fbs_mapping::build_failure_fbs;
use crate::{
    core_failure::CoreFailure,
    flatbuffers_generated::core_bootstrap_response_generated::{
        finish_core_bootstrap_response_buffer, CoreBootstrapResponse, CoreBootstrapResponseArgs,
    },
};
use flatbuffers::FlatBufferBuilder;

pub fn build_core_bootstrap_response(result: Result<(), CoreFailure>) -> Vec<u8> {
    let mut fbb = FlatBufferBuilder::new();
    let result = match result {
        Ok(_) => None,
        Err(failure) => Some(build_failure_fbs(&mut fbb, failure)),
    };

    let response_args = CoreBootstrapResponseArgs { failure: result };

    let response = CoreBootstrapResponse::create(&mut fbb, &response_args);
    finish_core_bootstrap_response_buffer(&mut fbb, response);
    fbb.finished_data().to_owned()
}

#[cfg(test)]
mod tests {
    use crate::flatbuffers_generated::core_bootstrap_response_generated::root_as_core_bootstrap_response;

    use super::*;

    #[test]
    fn test_build_success() {
        let byte_response = build_core_bootstrap_response(Ok(()));

        let parsed = root_as_core_bootstrap_response(&byte_response);
        assert!(
            parsed.is_ok(),
            "Expected response parsing to be successfull"
        );

        let response = parsed.unwrap();
        assert!(
            response.failure().is_none(),
            "Expected response to not contain failure"
        );
    }

    #[test]
    fn test_build_failure() {
        let expected_failure = CoreFailure::core_bootstrap_failed();
        let byte_response = build_core_bootstrap_response(Err(expected_failure.clone()));

        let parsed = root_as_core_bootstrap_response(&byte_response);
        assert!(
            parsed.is_ok(),
            "Expected response parsing to be successfull"
        );

        let response = parsed.unwrap();
        assert!(
            response.failure().is_some(),
            "Expected response to contain failure"
        );

        let failure = response.failure().unwrap();
        assert_eq!(failure.code(), expected_failure.code);
        assert_eq!(failure.message(), expected_failure.message.as_str());
    }
}
