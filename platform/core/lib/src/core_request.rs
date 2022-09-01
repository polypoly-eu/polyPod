use core_failure::CoreFailure;
use serde::Serialize;

use crate::core;

pub struct LoadFeatureCategoriesArguments {
    pub features_dir: String,
    pub force_show: Vec<feature_categories::FeatureCategoryId>,
}
enum CoreRequest {
    LoadFeatureCategories(LoadFeatureCategoriesArguments),
}


fn handle_core_request<Response: Serialize>(request: CoreRequest) -> impl Serialize {
    match request {
        CoreRequest::LoadFeatureCategories(args) => {
            core::load_feature_categories(args)
        },
    }
}
