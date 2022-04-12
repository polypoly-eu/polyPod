use crate::{
    core_failure::CoreFailure,
    flatbuffers_generated::failure_generated::{Failure, FailureArgs},
};
use flatbuffers::{FlatBufferBuilder, WIPOffset};

pub fn build_failure_fbs<'a>(
    fbb: &mut FlatBufferBuilder<'a>,
    failure: CoreFailure,
) -> WIPOffset<Failure<'a>> {
    let failure_args = FailureArgs {
        code: failure.code,
        message: Some(fbb.create_string(failure.message.as_str())),
    };
    Failure::create(fbb, &failure_args)
}
