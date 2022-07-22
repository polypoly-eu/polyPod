use oxigraph::{sparql::EvaluationError, store::StorageError};
use serde::Serialize;

#[derive(Debug, Clone, Serialize)]
pub enum FailureCode {
    ParsingError,
    StorageError,
    EvaluationError,
    ResultSerializationError
}

impl FailureCode {
    fn value(&self) -> i32 {
        (*self).clone() as i32
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct RdfFailure {
    pub code: i32,
    pub message: String,
}

impl RdfFailure {
    pub fn result_serialization_failed() -> RdfFailure {
        RdfFailure {
            code: FailureCode::ResultSerializationError.value(),
            message: String::from("Failed to serialize the query Result")
        }
    }

    pub fn failed_to_initialize_store(error: StorageError) -> RdfFailure {
        RdfFailure {
            code: FailureCode::StorageError.value(),
            message: error.to_string()
        }
    }

    pub fn map_evaluation_error(error: EvaluationError) -> RdfFailure {
        match error {
            EvaluationError::Parsing(error) => RdfFailure {
                code: FailureCode::ParsingError.value(),
                message: error.to_string()
            },
            EvaluationError::Storage(error) => RdfFailure { 
                code: FailureCode::StorageError.value(),
                 message: error.to_string() 
            },
            _ => RdfFailure {
                code: FailureCode::EvaluationError.value(),
                message: error.to_string() 
            }
        }
    }
}