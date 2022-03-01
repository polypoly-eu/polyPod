use flatbuffers::{FlatBufferBuilder, WIPOffset};

use crate::{kernel_failure::KernelFailure, failure_generated::failure::{Failure, FailureArgs}};

pub fn build_failure_fbs<'a>(fbb: &mut FlatBufferBuilder<'a>, failure: KernelFailure) -> WIPOffset<Failure<'a>> {
    let failure_args = FailureArgs {
        code: failure.code,
        message: Some(fbb.create_string(failure.message.as_str())),
    };
    Failure::create(fbb, &failure_args)
}